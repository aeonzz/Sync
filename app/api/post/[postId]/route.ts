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

  try {
    const comment = await prisma.comment.findMany({
      where: {
        postId: postId,
        parentId: null,
        deleted: false,
      },
      orderBy: {
        id: "asc",
      },
      include: {
        _count: {
          select: {
            commentLike: true,
            replies: true,
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
