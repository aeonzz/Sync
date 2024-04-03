"use server";

import prisma from "../db";

export async function createBanner(bannerUrl: string) {
  try {
    await prisma.banner.create({
      data: {
        bannerUrl,
      },
    });

    return { error: null, status: 200 };
  } catch (error: any) {
    console.log(error);
    return { error: error.message, status: 500 };
  }
}

export async function getBanner() {
  try {
    const response = await prisma.banner.findMany({
      orderBy: {
        id: "desc",
      },
    });

    return { data: response, error: null, status: 200 };
  } catch (error: any) {
    return { data: null, error: error.message, status: 500 };
  }
}
