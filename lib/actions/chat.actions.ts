"use server";

import { error } from "console";
import prisma from "../db";
import { redirect } from "next/navigation";

export async function createChannel(senderId: string, receiverId: string) {
  try {
    const hasChannelRecord = await prisma.channel.findUnique({
      where: {
        senderId_receiverId: {
          senderId,
          receiverId,
        },
      },
    });

    if (hasChannelRecord) return { redirect: true, error: null, status: 200 };

    await prisma.channel.create({
      data: {
        senderId,
        receiverId,
      },
    });
    return { redirect: false, error: null, status: 200 };
  } catch (error: any) {
    console.log(error);
    return { redirect: false, error: error.message, status: 500 };
  }
}
