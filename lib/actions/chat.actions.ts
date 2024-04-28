"use server";

import prisma from "../db";
import { ChannelType } from "@prisma/client";

export async function createChannel(to: string, from: string) {
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
      },
      include: {
        members: true,
      },
    });

    const doesChannelExist = Boolean(existingChannel);
    if (doesChannelExist) return { redirect: true, error: null, status: 200 };

    const channel = await prisma.channel.create({
      data: {
        isAccepted: true,
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
      },
    });

    return { redirect: false, error: null, status: 200 };
  } catch (error: any) {
    console.log(error);
    return { redirect: false, error: error.message, status: 500 };
  }
}
