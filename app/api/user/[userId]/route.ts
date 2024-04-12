import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: {
      userId: string;
    };
  },
) {
  const { userId } = params;
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        studentData: true,
      },
    });

    return NextResponse.json({ data: user }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "could not get post" },
      { status: 500 },
    );
  }
}
