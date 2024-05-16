import prisma from "@/lib/db";
import { ChannelStatus, ChannelType } from "@prisma/client";
import { NextResponse } from "next/server";

interface Context {
  params: {
    roomId: string;
  };
}

export async function GET(req: Request, context: Context) {
  const { roomId } = context.params;

  try {
    const room = await prisma.room.findFirst({
      where: {
        id: roomId,
      },
      include: {
        channels: {
          include: {
            members: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ room }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "Could not get chat" },
      { status: 500 },
    );
  }
}
