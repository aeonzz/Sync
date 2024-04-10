import prisma from "@/lib/db";
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
  try {
    const response = await prisma.post.findFirst({
      where: {
        postId: params.postId,
        deleted: false,
      },
      include: {
        _count: {
          select: {
            comment: true,
            postLike: true,
            imageUrls: true,
          },
        },
        author: {
          include: {
            studentData: true,
          },
        },
        imageUrls: true,
        postLike: {
          orderBy: {
            id: "desc",
          },
          include: {
            user: {
              include: {
                studentData: true,
              },
            },
          },
        },
        comment: {
          where: {
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
        },
      },
    });

    return NextResponse.json({ data: response }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "could not get post" },
      { status: 500 },
    );
  }
}
