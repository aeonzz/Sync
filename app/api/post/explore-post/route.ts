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
      },
      where: {
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
