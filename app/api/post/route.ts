import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { PostValidation } from "@/lib/validations/post";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, content } = PostValidation.parse(body);
    const session = await getServerSession(authOptions);

    const result = await prisma.post.create({
      data: {
        title: title,
        content: content,
        author: {
          connect: {
            id: session?.user.id,
          },
        },
      },
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { message: "could not create post" },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const cursorParam = url.searchParams.get("cursor");
    const cursor = cursorParam ? parseInt(cursorParam, 10) : undefined;

    const posts = await prisma.post.findMany({
      select: {
        sequenceId: true,
        author: true,
        createdAt: true,
        postId: true,
        content: true,
      },
      where: {
        sequenceId: cursor ? { lt: cursor } : undefined,
      },
      orderBy: {
        sequenceId: "desc",
      },
      take: 5
      ,
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
    return new Response(
      JSON.stringify(JSON.stringify({ error: error.message })),
      { status: 403 },
    );
  }
}
