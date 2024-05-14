import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: {
      userId: string;
    };
  },
) {
  const session = await getServerSession(authOptions);
  const { userId } = params;

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        studentData: true,
      },
    });

    const followRecord = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: session!.user.id,
          followingId: userId,
        },
      },
    });

    const userWithFollowStatus = {
      ...user,
      isFollowedByCurrentUser: followRecord !== null,
    };

    return NextResponse.json({ data: userWithFollowStatus }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "could not get post" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const { userId } = await req.json();
  
  await pusherServer.trigger('presence-channel', 'user-online', {
    userId: userId,
  });

  return NextResponse.json({ status: 'User status updated' });
}