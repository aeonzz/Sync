import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  try {
    const currentUserFollowing = await prisma.follows.findMany({
      where: {
        followerId: session?.user.id,
      },
      select: {
        following: {
          include: {
            studentData: true,
          },
        },
      },
    });

    return NextResponse.json(
      { users: currentUserFollowing.map((following) => following.following) },
      { status: 200 },
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "could not get users" },
      { status: 500 },
    );
  }
}
