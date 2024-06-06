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
    const channels = await prisma.channel.findMany({
      where: {
        type: ChannelType.PRIVATE,
        members: {
          some: {
            userId: userId,
            isConfirmed: true,
          },
        },
        // status: ChannelStatus.ACCEPTED,
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json({ channels }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "Could not get chat" },
      { status: 500 },
    );
  }
}
