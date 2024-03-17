"use server";

import prisma from "../db";

export async function getUser(userId: string) {
  try {
    const response = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        StudentData: true,
      },
    });

    return { data: response, error: null, status: 200 };
  } catch (error: any) {
    return { data: null, error: error.message, status: 500 };
  }
}

interface Params {
  userId: string;
  username?: string | undefined;
  bio?: string | undefined;
  avatarUrl?: string | undefined;
  coverUrl?: string | undefined;
  onboarded?: boolean | undefined;
  urls?: {
    value: string;
  }[] | null;
}

export async function updateUser({
  userId,
  username,
  bio,
  urls,
  avatarUrl,
  coverUrl,
  onboarded,
}: Params) {
  try {
    const updateData: Record<string, unknown> = {};
    if (username !== undefined) {
      updateData.username = username;
    }
    if (bio !== undefined) {
      updateData.bio = bio;
    }
    if (avatarUrl !== undefined) {
      updateData.avatarUrl = avatarUrl;
    }
    if (coverUrl !== undefined) {
      updateData.coverUrl = coverUrl;
    }
    if (onboarded !== undefined) {
      updateData.onboarded = onboarded;
    }
    if (urls !== undefined && urls !== null) {
      updateData.Urls = {
        create: urls.map(url => ({ url: url.value })),
      };
    }

    const response = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });


    return { data: response, error: null, status: 200 };
  } catch (error: any) {
    console.log(error)
    return { data: null, error: error.message, status: 500 };
  }
}