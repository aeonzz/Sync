"use server";

import prisma from "../db";

export async function createChannel(senderId: string, receiverId: string) {
  try {
    const channel = await prisma.channel.create({
      data: {
        senderId,
        receiverId,
      },
    });
  } catch (error: any) {
    console.log(error);
    return { data: null, error: error.message, status: 500 };
  }
}
