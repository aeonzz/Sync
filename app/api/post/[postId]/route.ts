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
        sequenceId: "desc",
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
            sequenceId: "asc",
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

export async function PATCH(req: Request, params: Context) {
  const { postId } = params.params;
  const body = await req.json();

  try {
    const existingLike = await prisma.postLike.findUnique({
      where: {
        userId_postId: {
          userId: body.userId,
          postId,
        },
      },
    });

    if (existingLike) {
      await prisma.postLike.delete({
        where: {
          id: existingLike.id,
        },
      });
    } else {
      await prisma.postLike.create({
        data: {
          userId: body.userId,
          postId,
        },
      });
    }
    
    return NextResponse.json({ data: existingLike }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "could not get post" },
      { status: 500 },
    );
  }
}