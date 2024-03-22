"use server";

import prisma from "../db";

export async function createBanner(bannerUrl: string) {
  try {
    const response = await prisma.banner.create({
      data: {
        bannerUrl,
      },
    });

    return { data: response, error: null, status: 200 };
  } catch (error: any) {
    console.log(error);
    return { data: null, error: error.message, status: 500 };
  }
}

export async function getBanners() {
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
