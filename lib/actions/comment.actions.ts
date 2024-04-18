"use server";

import prisma from "../db";

interface CreateCommentParams {
  postId: string;
  userId: string;
  text: string;
  parentId?: string | undefined;
}

export async function createComment({
  postId,
  userId,
  text,
  parentId,
}: CreateCommentParams) {
  try {
    const comment = await prisma.comment.create({
      data: {
        postId,
        userId,
        text: text,
        parentId,
      },
    });

    return { data: comment, error: null, status: 200 };
  } catch (error: any) {
    console.log(error);
    return { data: null, error: error.message, status: 500 };
  }
}

interface likeCommentProps {
  userId: string;
  commentId: string;
}

export async function likeComment({ userId, commentId }: likeCommentProps) {
  try {
    const existingLike = await prisma.commentLike.findUnique({
      where: {
        userId_commentId: {
          userId,
          commentId,
        },
      },
    });

    if (existingLike) {
      await prisma.commentLike.delete({
        where: {
          id: existingLike.id,
        },
      });
    } else {
      await prisma.commentLike.create({
        data: {
          userId,
          commentId,
        },
      });
    }

    const newLikes = await prisma.commentLike.findMany({
      where: {
        commentId: commentId,
      },
      select: {
        id: true,
        user: {
          select: {
            id: true,
            studentId: true,
            username: true,
            avatarUrl: true,
            coverUrl: true,
            createdAt: true,
            studentData: {
              select: {
                firstName: true,
                middleName: true,
                lastName: true,
                department: true,
              },
            },
          },
        },
      },
    });

    return { data: newLikes, error: null, status: 200 };
  } catch (error: any) {
    console.log(error);
    return { data: null, error: error.message, status: 500 };
  }
}

export async function checkIfUserLikedComment(
  userId: string,
  commentId: string,
) {
  const likeRecord = await prisma.commentLike.findUnique({
    where: {
      userId_commentId: {
        userId: userId,
        commentId: commentId,
      },
    },
  });

  return likeRecord !== null;
}

export async function deleteComment(commentId: string) {
  try {
    await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        deleted: true,
      },
    });
    return { error: null, status: 200 };
  } catch (error: any) {
    console.log(error);
    return { error: error.message, status: 500 };
  }
}

interface UpdateCommentParams {
  text: string;
  commentId: string;
}

export async function updateComment({ text, commentId }: UpdateCommentParams) {
  try {
    const comment = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        text: text,
      },
    });
    return { data: comment, error: null, status: 200 };
  } catch (error: any) {
    console.log(error);
    return { data: null, error: error.message, status: 500 };
  }
}
