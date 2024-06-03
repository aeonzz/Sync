import prisma from "@/lib/db";
import { PostType } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const newAnnouncement = await prisma.post.findMany({
    where: {
      type: PostType.ANNOUNCEMENT,
    },
    include: {
      imageUrls: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
  });

  try {
    return NextResponse.json({ data: newAnnouncement }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "could not get post" },
      { status: 500 },
    );
  }
}
