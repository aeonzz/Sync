"use server";

import prisma from "../db";
import { NotificationType } from "@prisma/client";

interface CreateNotificationParams {
  type: NotificationType;
  from: string;
  resourceId: string;
  text: string;
}

export async function createNotification({
  type,
  from,
  resourceId,
  text,
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

    for (const follower of followers) {
      await prisma.notification.create({
        data: {
          recipientId: follower.followerId,
          type,
          resourceId,
          fromId: from,
          text,
        },
      });
    }

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
      }
    })

    return { error: null, status: 200 };
  } catch (error: any) {
    console.log(error);
    return { error: error.message, status: 500 };
  }
}
