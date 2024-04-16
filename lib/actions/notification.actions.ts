"use server";

import prisma from "../db";
import { NotificationType } from "@prisma/client";

interface CreateNotificationParams {
  type: NotificationType;
  from: string;
  resourceId: string;
}

export async function createNotification({
  type,
  from,
  resourceId,
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
          from,
          resourceId,
        },
      });
    }

    return { error: null, status: 200 };
  } catch (error: any) {
    console.log(error);
    return { error: error.message, status: 500 };
  }
}
