import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { userId: string } },
) {
  try {
    const userId = params.userId;
    const body = await req.json();
    const { username, bio, avatarUrl, onboarded } = body;

    const updateData: Record<string, unknown> = {};
    if (username !== undefined) {
      updateData.displayName = username;
    }
    if (bio !== undefined) {
      updateData.bio = bio;
    }
    if (avatarUrl !== undefined) {
      updateData.avatarUrl = avatarUrl;
    }
    if (onboarded !== undefined) {
      updateData.onboarded = onboarded;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json(
      { updatedUser, message: "User updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Could not update User" },
      { status: 500 },
    );
  }
}
