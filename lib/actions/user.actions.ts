"use server";

import { hash } from "bcrypt";
import prisma from "../db";
import { revalidatePath } from "next/cache";
import { pusherServer } from "../pusher";

export async function getUserById(userId: string) {
  try {
    const response = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        studentData: true,
        following: true,
        _count: {
          select: {
            following: true,
          },
        },
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
}

export async function updateUser({
  userId,
  username,
  bio,
  avatarUrl,
  coverUrl,
  onboarded,
}: UpdateUserParams) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        username,
        bio,
        avatarUrl,
        coverUrl,
        onboarded,
      },
    });

    return { error: null, status: 200 };
  } catch (error: any) {
    console.log(error);
    return { error: error.message, status: 500 };
  }
}

export async function resetPassword(
  resetPasswordToken: string,
  password: string,
) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        resetPasswordToken,
      },
    });

    if (!user) return { data: null, error: "User not found", status: 500 };

    const resetPasswordTokenExpiry = user.resetPasswordTokenExpiry;

    if (!resetPasswordTokenExpiry)
      return { data: null, error: "Token expired", status: 500 };

    const today = new Date();
    const isTokenExpired = today > resetPasswordTokenExpiry;

    if (isTokenExpired)
      return { data: null, error: "Token expired", status: 500 };

    const hashedPassword = await hash(password, 10);
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordTokenExpiry: null,
      },
    });

    return { error: null, status: 200 };
  } catch (error: any) {
    return { error: error.message, status: 500 };
  }
}

export async function checkIfCurrentUserFollowedUser(
  followerId: string,
  followingId: string,
) {
  const likeRecord = await prisma.follows.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });

  return likeRecord !== null;
}

export async function followUser(followerId: string, followingId: string) {
  try {
    const isFollowed = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (isFollowed) {
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId,
            followingId,
          },
        },
      });
    } else {
      await prisma.follows.create({
        data: {
          followerId,
          followingId,
        },
      });
    }

    const newData = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    return { data: newData !== null, error: null, status: 200 };
  } catch (error: any) {
    console.log(error);
    return { error: error.message, status: 500 };
  }
}

// export async function handleUserPresence(userId: string) {
//   pusherServer.trigger("presence-channel", "user-status", "tangina");
//   try {
//     return { error: null, status: 200 };
//   } catch (error: any) {
//     console.log(error);
//     return { error: error.message, status: 500 };
//   }
// }
