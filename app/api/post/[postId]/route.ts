import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: {
      postId: string;
    };
  },
) {

  const session = await getServerSession(authOptions)

  try {
    const comment = await prisma.comment.findMany({
      where: {
        postId: params.postId,
        parentId: null,
        deleted: false,
      },
      orderBy: {
        id: "desc",
      },
      include: {
        _count: {
          select: {
            commentLike: true,
            replies: true,
          },
        },
        commentLike: {
          where: {
            userId: session!.user.id,
          },
          select: {
            id: true,
            user: {
              include: {
                studentData: true,
              },
            },
          },
        },
        user: {
          include: {
            studentData: true,
          },
        },
        replies: {
          where: {
            deleted: false,
          },
          orderBy: {
            id: "asc",
          },
          include: {
            _count: {
              select: {
                commentLike: true,
              },
            },
            commentLike: {
              select: {
                id: true,
                user: {
                  include: {
                    studentData: true,
                  },
                },
              },
            },
            user: {
              include: {
                studentData: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ data: comment }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "could not get post" },
      { status: 500 },
    );
  }
}
