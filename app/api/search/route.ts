import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const searchTerm = searchParams.get("q");

    if (!searchTerm)
      return NextResponse.json(
        { message: "An internal server error occurred" },
        { status: 500 },
      );

    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            username: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
          {
            studentData: {
              firstName: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          },
          {
            studentData: {
              middleName: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          },
          {
            studentData: {
              lastName: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          },
        ],
      },
      include: {
        studentData: true,
      },
    });

    const posts = await prisma.post.findMany({
      where: {
        OR: [
          {
            content: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        ],
      },
    });

    return NextResponse.json({ users: users, posts: posts }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "An internal server error occurred" },
      { status: 500 },
    );
  }
}
