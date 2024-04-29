import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { message: "Could not get user" },
      { status: 200 },
    );
  }

  try {
    const channels = await prisma.channelMember.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        channel: {
          include: {
            members: {
              where: {
                userId: {
                  not: session.user.id,
                },
              },
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      { channels: channels.map((channel) => channel.channel) },
      { status: 200 },
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "Could not get chat" },
      { status: 500 },
    );
  }
}
