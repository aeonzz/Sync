import prisma from "@/lib/db";
import { PostType } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const recentEvents = await prisma.event.findMany({
    where: {
      deleted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  try {
    return NextResponse.json({ data: recentEvents }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "could not get post" },
      { status: 500 },
    );
  }
}
