"use server";

import { hash } from "bcrypt";
import prisma from "../db";

export async function getUserById(userId: string) {
  try {
    const response = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        StudentData: true,
        Urls: true,
      },
    });

    return { data: response, error: null, status: 200 };
  } catch (error: any) {
    return { data: null, error: error.message, status: 500 };
  }
}

interface UpdateUserParams {
  userId: string;
  username?: string | undefined;
  bio?: string | undefined;
  avatarUrl?: string | undefined;
  coverUrl?: string | undefined;
  onboarded?: boolean | undefined;
  urls?:
    | {
        value: string;
      }[]
    | null;
}

export async function updateUser({
  userId,
  username,
  bio,
  urls,
  avatarUrl,
  coverUrl,
  onboarded,
}: UpdateUserParams) {
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
        create: urls.map((url) => ({ url: url.value })),
      };
    }

    const response = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return { data: response, error: null, status: 200 };
  } catch (error: any) {
    console.log(error);
    return { data: null, error: error.message, status: 500 };
  }
}

export async function resetPassword(resetPasswordToken: string, password: string) {
  try {
    
    const user = await prisma.user.findUnique({
      where: {
        resetPasswordToken,
      },
    })

    if (!user) return { data: null, error: "User not found", status: 500 };
  
    const resetPasswordTokenExpiry = user.resetPasswordTokenExpiry

    if (!resetPasswordTokenExpiry) return { data: null, error: "Token expired", status: 500 };
 
    const today = new Date();
    const isTokenExpired = today > resetPasswordTokenExpiry;

    if (isTokenExpired) return { data: null, error: "Token expired", status: 500 };

    const hashedPassword = await hash(password, 10);
    const response = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordTokenExpiry: null,
      },
    });

    return { data: response, error: null, status: 200 };
  } catch (error: any) {
    return { data: null, error: error.message, status: 500 };
  }
}
