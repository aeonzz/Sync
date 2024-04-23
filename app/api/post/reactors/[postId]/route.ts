import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { postId: string } },
) {
  const session = await getServerSession(authOptions);
  const { postId } = params;

  try {
    const reactors = await prisma.postLike.findMany({
      where: {
        postId: postId,
      },
      include: {
        user: {
          include: {
            following: true,
            _count: {
              select: {
                following: true,
              },
            },
          },
        },
      },
    });

    const reactorsWithFollowStatus = await Promise.all(
      reactors.map(async (reactor) => {
        const followRecord = await prisma.follows.findUnique({
          where: {
            followerId_followingId: {
              followerId: session!.user.id,
              followingId: reactor.user.id,
            },
          },
        });

        return {
          ...reactor,
          isFollowedByCurrentUser: followRecord !== null,
        };
      }),
    );

    return NextResponse.json(
      { data: reactorsWithFollowStatus },
      { status: 200 },
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "could not get reactors" },
      { status: 500 },
    );
  }
}
