"use server";

import prisma from "../db";

export async function getPosts(page: number) {
  const take = 10;
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

    const hasMore = response.length === take
    
    return { data: response, hasMore, error: null, status: 200 };
  } catch (error: any) {
    console.log(error);
    return { data: null, error: error.message, status: 500 };
  }
}
