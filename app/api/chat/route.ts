import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { message: "Could not get user" },
      { status: 200 },
    );
  }

  try {
    const chats = await prisma.channel.findMany({
      where: {
        OR: [
          {
            senderId: session.user.id,
          },
          {
            receiverId: session.user.id,
          },
        ],
      },
    });

    return NextResponse.json({ chats }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "Could not get post" },
      { status: 500 },
    );
  }
}
