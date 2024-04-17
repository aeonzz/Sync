import prisma from "@/lib/db";
import { NextResponse } from "next/server";

interface Context {
  params: {
    userId: string;
  };
}

export async function GET(req: Request, params: Context) {
  const { userId } = params.params;

  try {
    const notifications = await prisma.notification.findMany({
      where: {
        recipientId: userId,
      },
      include: {
        from: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json({ data: notifications }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "could not get post" },
      { status: 500 },
    );
  }
}
