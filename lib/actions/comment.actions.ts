"use server";

import prisma from "../db";

interface CreateCommentParams {
  postId: string;
  userId: string;
  text: string;
  parentId?: number | undefined;
}

export async function createComment({
  postId,
  userId,
  text,
  parentId,
}: CreateCommentParams) {
  try {
    await prisma.comment.create({
      data: {
        postId,
        userId,
        text: text,
        parentId,
      },
    });

    return { error: null, status: 200 };
  } catch (error: any) {
    console.log(error);
    return { error: error.message, status: 500 };
  }
}

interface likeCommentProps {
  userId: string;
  commentId: number;
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

    return { error: null, status: 200 };
  } catch (error: any) {
    console.log(error);
    return { error: error.message, status: 500 };
  }
}

export async function checkIfUserLikedComment(
  userId: string,
  commentId: number,
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

export async function deleteComment(commentId: number) {
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
  commentId: number
}


export async function updateComment({text, commentId} : UpdateCommentParams) {
  try {
    await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        text: text,
      },
    });
    return { error: null, status: 200 };
  } catch (error: any) {
    console.log(error);
    return { error: error.message, status: 500 };
  }
}
