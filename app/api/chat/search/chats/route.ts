import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const searchTerm = searchParams.get("q");

  try {
    if (!searchTerm)
      return NextResponse.json(
        { message: "An internal server error occurred" },
        { status: 500 },
      );

    const channels = await prisma.channelMember.findMany({
      where: {
        user: {
          username: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      },
      select: {
        channel: {
          include: {
            members: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      { channels: channels.map((channel) => channel.channel) },
      { status: 201 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "An internal server error occurred" },
      { status: 500 },
    );
  }
}
