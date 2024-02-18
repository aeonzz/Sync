import prisma from "@/lib/db";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url, postId, } = body

    const result = await prisma.image.create({
      data: {
        url: url,
        postId: postId,
      },
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: 'could not create image' }, { status: 500 })
  }
}