import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const users = await prisma.user.findMany({
      include: {
        followers: true,
        studentData: true,
      },
    });

    const usersSortedByFollowers = users.sort(
      (a, b) => b.followers.length - a.followers.length,
    );

    const top5Users = usersSortedByFollowers.slice(0, 5);

    console.log(top5Users)

    return NextResponse.json({ data: top5Users }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "could not get users" },
      { status: 500 },
    );
  }
}
