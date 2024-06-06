"use server";

import prisma from "../db";
import { ChannelStatus, ChannelType } from "@prisma/client";
import { pusherServer } from "../pusher";

export async function createChannel({
  to,
  from,
}: {
  to: string;
  from: string;
}) {
  try {
    const existingChannel = await prisma.channel.findFirst({
      where: {
        members: {
          every: {
            userId: {
              in: [to, from],
            },
          },
        },
        type: ChannelType.PRIVATE,
      },
      include: {
        members: true,
      },
    });

    const doesChannelExist = Boolean(existingChannel);
    if (doesChannelExist)
      return {
        channel: existingChannel?.id,
        redirect: true,
        error: null,
        status: 200,
      };

    const channel = await prisma.channel.create({
      data: {
        type: ChannelType.PRIVATE,
      },
    });

    await prisma.channelMember.create({
      data: {
        userId: to,
        channelId: channel.id,
      },
    });

    await prisma.channelMember.create({
      data: {
        userId: from,
        channelId: channel.id,
        isConfirmed: true,
      },
    });

    return { channel, error: null, status: 200 };
  } catch (error: any) {
    console.log(error);
    return {
      channel: null,
      error: error.message,
      status: 500,
    };
  }
}

export async function createRoom(name: string, currentUserId: string) {
  try {
    const room = await prisma.room.create({
      data: {
        roomName: name,
      },
    });
    const channel = await prisma.channel.create({
      data: {
        type: ChannelType.GROUP,
        status: ChannelStatus.ACCEPTED,
        roomId: room.id,
        channelName: "General",
      },
    });
    await prisma.channelMember.create({
      data: {
        userId: currentUserId,
        channelId: channel.id,
      },
    });
    return { data: { room, channel }, error: null, status: 200 };
  } catch (error: any) {
    console.log(error);
    return { data: null, error: error.message, status: 500 };
  }
}

export async function checkRoomId(roomId: string) {
  try {
    const existingRoom = await prisma.room.findFirst({
      where: {
        id: roomId,
      },
    });
    return { data: existingRoom !== null, error: null, status: 200 };
  } catch (error: any) {
    console.log(error);
    return { existingRoom: null, error: error.message, status: 500 };
  }
}

export async function inviteUser(roomId: string, userId: string) {
  try {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { channels: true },
    });

    if (!room) {
      return { error: "Room not found", status: 404 };
    }

    const existingMemberships = await prisma.channelMember.findMany({
      where: {
        userId,
        channelId: {
          in: room.channels.map((channel) => channel.id),
        },
      },
    });

    await prisma.$transaction(async () => {
      for (const channel of room.channels) {
        const isMember = existingMemberships.some(
          (m) => m.channelId === channel.id,
        );
        if (!isMember) {
          await prisma.channelMember.create({
            data: {
              userId,
              channelId: channel.id,
            },
          });
        }
      }
    });
    return {
      error: null,
      status: existingMemberships.length > 0 ? 208 : 200,
    };
  } catch (error: any) {
    console.log(error.message);
    return { error: error.message, status: 500 };
  }
}

export async function getRoomByID({ roomId }: { roomId: string }) {
  try {
    const room = await prisma.room.findFirst({
      where: {
        id: roomId,
      },
    });

    return { data: room, error: null, status: 200 };
  } catch (error: any) {
    console.log(error);
    return { data: null, error: error.message, status: 500 };
  }
}

export async function getChannelById(channelId: string, currentUserId: string) {
  try {
    const channel = await prisma.channel.findFirst({
      where: {
        id: channelId,
      },
      include: {
        members: {
          where: {
            userId: {
              not: currentUserId,
            },
          },
          include: {
            user: true,
          },
        },
      },
    });

    return { data: channel, error: null, status: 200 };
  } catch (error: any) {
    return { data: null, error: error.message, status: 500 };
  }
}

interface UpdateMessageParams {
  messageId: string;
  text: string;
  channelId: string;
}

export async function updateMessage({
  messageId,
  text,
  channelId,
}: UpdateMessageParams) {
  try {
    const updatedMessage = await prisma.message.update({
      where: {
        id: messageId,
      },
      data: {
        text,
      },
      include: {
        sender: true,
        parent: {
          include: {
            sender: true,
          },
        },
        messageReaction: {
          include: {
            user: true,
          },
        },
      },
    });

    pusherServer.trigger(channelId, "updated-message", updatedMessage);
    return { error: null, status: 200 };
  } catch (error: any) {
    return { error: error.message, status: 500 };
  }
}

export async function deleteMessage(messageId: string, channelId: string) {
  try {
    const deletedMessage = await prisma.message.update({
      where: {
        id: messageId,
      },
      data: {
        deleted: true,
      },
      include: {
        sender: true,
        parent: {
          include: {
            sender: true,
          },
        },
        messageReaction: {
          include: {
            user: true,
          },
        },
      },
    });

    pusherServer.trigger(channelId, "updated-message", deletedMessage);
    return { error: null, status: 200 };
  } catch (error: any) {
    return { error: error.message, status: 500 };
  }
}

interface CreateReactionParams {
  messageId: string;
  reaction: string;
  userId: string;
}

export async function createReaction({
  messageId,
  reaction,
  userId,
}: CreateReactionParams) {
  try {
    const newReaction = await prisma.messageReaction.create({
      data: {
        messageId,
        reaction,
        userId,
      },
      include: {
        user: true,
      },
    });

    pusherServer.trigger(messageId, "incoming-reaction", newReaction);

    return { error: null, status: 200 };
  } catch (error: any) {
    return { error: error.message, status: 500 };
  }
}

export async function removeReaction(reactionId: string, messageId: string) {
  try {
    const removedReaction = await prisma.messageReaction.delete({
      where: {
        id: reactionId,
      },
    });

    pusherServer.trigger(messageId, "deleted-reaction", removedReaction);

    return { error: null, status: 200 };
  } catch (error: any) {
    return { error: error.message, status: 500 };
  }
}

export async function updateMessageRequest(
  channelId: string,
  status: ChannelStatus,
) {
  try {
    await prisma.$transaction([
      prisma.channel.update({
        where: {
          id: channelId,
        },
        data: {
          status: status,
        },
      }),
      prisma.channelMember.updateMany({
        where: {
          channelId: channelId,
        },
        data: {
          isConfirmed: true,
        },
      }),
    ]);
    return { error: null, status: 200 };
  } catch (error: any) {
    return { error: error.message, status: 500 };
  }
}
