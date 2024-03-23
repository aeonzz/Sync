"use server";

import prisma from "../db";

interface Params {
  url: string;
  postId: string;
}

export async function AppendImage({ url, postId }: Params) {
  try {
    const response = await prisma.image.create({
      data: {
        url: url,
        postId: postId,
      },
    });

    return { data: response, error: null, status: 200 };
  } catch (error: any) {
    console.log(error);
    return { data: null, error: error.message, status: 500 };
  }
}
