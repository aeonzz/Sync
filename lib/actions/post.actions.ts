"use server";

import { getServerSession } from "next-auth";
import prisma from "../db";
import { authOptions } from "../auth";

export async function getPosts(page: number) {
  const take = 7;
  const skip = (page - 1) * take;

  try {
    const response = await prisma.post.findMany({
      include: {
        author: {
          include: {
            StudentData: true,
          },
        },
        imageUrls: true,
      },
      take,
      skip,
      orderBy: {
        sequenceId: "desc",
      },
    });

    const hasMore = response.length === take;

    return { data: response, hasMore, error: null, status: 200 };
  } catch (error: any) {
    console.log(error);
    return { data: null, error: error.message, status: 500 };
  }
}

interface Params {
  title?: string | undefined;
  content: string
  // imageUrls: string[] | undefined
}

export async function CreatePost({ title, content }: Params) {
  const session = await getServerSession(authOptions)
  try {
    const response = await prisma.post.create({
      data: {
        title: title,
        content: content,
        author: {
          connect: {
            id: session?.user.id,
          },
        },
      },
    });

    return { data: response, error: null, status: 200 };
  } catch (error: any) {
    console.log(error);
    return { data: null, error: error.message, status: 500 };
  }
}
