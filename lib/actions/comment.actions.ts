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
    const response = await prisma.comment.create({
      data: {
        postId,
        userId,
        text: text,
        parentId,
      },
    });

    return { data: response, error: null, status: 200 };
  } catch (error: any) {
    console.log(error);
    return { data: null, error: error.message, status: 500 };
  }
}
