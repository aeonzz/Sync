import prisma from "@/lib/db";
import { ChannelStatus, ChannelType } from "@prisma/client";
import { NextResponse } from "next/server";

interface Context {
  params: {
    userId: string;
  };
}

export async function GET(req: Request, context: Context) {
  const { userId } = context.params;
  try {
    const userRooms = await prisma.room.findMany({
      where: {
        channels: {
          some: {
            members: {
              some: {
                userId: userId,
              },
            },
          },
        },
      },
      include: {
        channels: {
          select: {
            id: true,
          },
        },
      },
    });

    return NextResponse.json({ userRooms }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "Could not get chat" },
      { status: 500 },
    );
  }
}
