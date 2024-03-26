import { authOptions } from "@/lib/auth";
import * as z from "zod";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

const PostSchema = z.object({
  title: z.string().optional().nullable(),
  content: z.string().min(10),
});

export async function PATCH(
  req: Request,
  { params }: { params: { postId: string } },
) {
  try {
    const body = await req.json();
    const { title, content } = PostSchema.parse(body);

    const updateData: Record<string, unknown> = {};

    if (title !== undefined) {
      updateData.title = title;
    }
    if (content !== undefined) {
      updateData.content = content;
    }

    const updatePost = await prisma.post.update({
      where: { postId: params.postId },
      data: updateData,
    });

    return NextResponse.json(
      { post: updatePost, message: "Post updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "could not update post" },
      { status: 500 },
    );
  }
}
