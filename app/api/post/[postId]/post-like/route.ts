import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

interface Context {
  params: {
    postId: string;
  };
}

export async function GET(req: Request, params: Context) {
  const { postId } = params.params;
  const session = await getServerSession(authOptions);

  try {
    const postLikedByCurrentUser = await prisma.postLike.findUnique({
      where: {
        userId_postId: {
          userId: session!.user.id,
          postId,
        },
      },
    });

    const newLikes = await prisma.postLike.findMany({
      where: {
        postId: postId,
      },
      include: {
        user: {
          include: {
            studentData: true,
          },
        },
      },
    });
    return NextResponse.json(
      { data: { liked: postLikedByCurrentUser !== null, newLikes: newLikes } },
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
