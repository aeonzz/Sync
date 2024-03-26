"use server";

import getBase64 from "../base64";
import prisma from "../db";

interface Params {
  url: string;
  postId: string;
}

export async function appendImage({ url, postId }: Params) {
  try {

    const blurDataUrl = await getBase64(url)

    const response = await prisma.image.create({
      data: {
        url: url,
        blurDataUrl: blurDataUrl ? blurDataUrl : "",
        postId: postId,
      },
    });

    return { data: response, error: null, status: 200 };
  } catch (error: any) {
    console.log(error);
    return { data: null, error: error.message, status: 500 };
  }
}

export async function deleteImage(id: number) {
  try {
    const response = await prisma.image.delete({
      where: {
        id
      },
    });

    return { data: response, error: null, status: 200 };
  } catch (error: any) {
    console.log(error);
    return { data: null, error: error.message, status: 500 };
  }
}
