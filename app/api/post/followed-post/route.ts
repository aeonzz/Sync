import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const cursorParam = url.searchParams.get("cursor");
    const cursor = cursorParam ? parseInt(cursorParam, 10) : undefined;
    const session = await getServerSession(authOptions);

    const followingPosts = await prisma.follows.findMany({
      where: { followerId: session?.user.id },
      select: {
        following: {
          select: {
            post: {
              select: {
                postId: true,
              },
            },
          },
        },
      },
    });

    const posts = await prisma.post.findMany({
      include: {
        _count: {
          select: {
            comment: true,
            imageUrls: true,
            postLike: true,
          },
        },
        author: {
          include: {
            studentData: true,
          },
        },
        imageUrls: true,
        postLike: {
          orderBy: {
            id: "desc",
          },
          include: {
            user: {
              include: {
                studentData: true,
              },
            },
          },
        },
      },
      where: {
        postId: {
          in: followingPosts.flatMap((follow) =>
            follow.following.post.map((post) => post.postId),
          ),
        },
        sequenceId: cursor ? { lt: cursor } : undefined,
        deleted: false,
      },
      orderBy: {
        sequenceId: "desc",
      },
      take: 5,
    });
    const lastPost = posts[posts.length - 1];
    const nextCursor = lastPost?.sequenceId || undefined;

    const postWithLikedStatus = await Promise.all(
      posts.map(async (post) => {
        const likeRecord = await prisma.postLike.findUnique({
          where: {
            userId_postId: {
              userId: session!.user.id,
              postId: post.postId,
            },
          },
        });

        return {
          ...post,
          isLikedByCurrentUser: likeRecord !== null,
        };
      }),
    );

    return NextResponse.json(
      {
        data: postWithLikedStatus,
        nextCursor,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "could not get post" },
      { status: 500 },
    );
  }
}
