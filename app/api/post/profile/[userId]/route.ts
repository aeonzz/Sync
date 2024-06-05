import prisma from "@/lib/db";
import { PostType } from "@prisma/client";
import { NextResponse } from "next/server";

interface Context {
  params: {
    userId: string;
  };
}

export async function GET(req: Request, context: Context) {
  const { userId } = context.params;
  const url = new URL(req.url);
  const cursorParam = url.searchParams.get("cursor");
  const cursor = cursorParam ? parseInt(cursorParam, 10) : undefined;

  try {
    const posts = await prisma.post.findMany({
      where: {
        sequenceId: cursor ? { lt: cursor } : undefined,
        deleted: false,
        type: PostType.POST,
        author: {
          id: userId,
        },
      },
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
      },
      orderBy: {
        sequenceId: "desc",
      },
      take: 5,
    });
    const lastPost = posts[posts.length - 1];
    const nextCursor = lastPost?.sequenceId || undefined;

    return NextResponse.json(
      {
        data: posts,
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
