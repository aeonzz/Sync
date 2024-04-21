"use server";

import prisma from "../db";
import { NotificationType } from "@prisma/client";
import { pusherServer } from "../pusher";

interface CreateNotificationParams {
  type: NotificationType;
  from: string;
  resourceId: string;
  text: string;
  recipientId?: string | undefined;
}

export async function createNotification({
  type,
  from,
  resourceId,
  text,
  recipientId,
}: CreateNotificationParams) {
  try {
    const followers = await prisma.follows.findMany({
      where: {
        followingId: from,
      },
      select: {
        followerId: true,
      },
    });

    let notificationsRecord;

    if (type === "LIKE") {
      notificationsRecord = await prisma.notification.findFirst({
        where: {
          fromId: from,
          resourceId,
        },
      });
    }

    if (recipientId === undefined) {
      for (const follower of followers) {
        const newNotification = await prisma.notification.create({
          data: {
            recipientId: follower.followerId,
            type,
            resourceId,
            fromId: from,
            text,
          },
          include: {
            from: {
              select: {
                id: true,
                username: true,
                avatarUrl: true,
              },
            },
          },
        });
        pusherServer.trigger(
          "notify-post",
          "incoming-notification",
          newNotification,
        );
      }
    } else {
      if (!notificationsRecord) {
        const newNotification = await prisma.notification.create({
          data: {
            recipientId,
            type,
            resourceId,
            fromId: from,
            text,
          },
          include: {
            from: {
              select: {
                id: true,
                username: true,
                avatarUrl: true,
              },
            },
          },
        });
        pusherServer.trigger(
          "notify-post",
          "incoming-notification",
          newNotification,
        );
      }
    }

    pusherServer.trigger("new-notification", "incoming-notification", "yawa");

    return { error: null, status: 200 };
  } catch (error: any) {
    console.log(error);
    return { error: error.message, status: 500 };
  }
}

export async function updateReadStatus(notificationId: number) {
  try {
    await prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        isRead: true,
      },
    });

    return { error: null, status: 200 };
  } catch (error: any) {
    console.log(error);
    return { error: error.message, status: 500 };
  }
}

export async function updateAllReadStatus(recipientId: string) {
  try {
    await prisma.notification.updateMany({
      where: {
        recipientId,
      },
      data: {
        isRead: true,
      },
    });

    return { error: null, status: 200 };
  } catch (error: any) {
    console.log(error);
    return { error: error.message, status: 500 };
  }
}

export async function getPostNotifications(resourceId: string) {
  try {
    const notification = await prisma.notification.findMany({
      where: {
        resourceId,
      },
    });
  } catch (error: any) {}
}
