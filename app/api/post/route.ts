import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { PostValidation } from "@/lib/validations/post";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, content} = PostValidation.parse(body)
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
    console.error('Error creating post:', error);
    return NextResponse.json({ message: 'could not create post' }, { status: 500 })
  }
}