import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  try {
    const users = await prisma.user.findMany({
      include: {
        following: true,
        _count: {
          select: {
            following: true,
          },
        },
      },
    });

    const usersSortedByFollowers = users.sort(
      (a, b) => b.following.length - a.following.length,
    );

    const top5Users = usersSortedByFollowers.slice(0, 5);

    const usersWithFollowStatus = await Promise.all(
      top5Users.map(async (user) => {
        const followRecord = await prisma.follows.findUnique({
          where: {
            followerId_followingId: {
              followerId: session!.user.id,
              followingId: user.id,
            },
          },
        });

        return {
          user: {
            ...user,
          },
          isFollowedByCurrentUser: followRecord !== null,
        };
      }),
    );

    return NextResponse.json({ data: usersWithFollowStatus }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "could not get users" },
      { status: 500 },
    );
  }
}
