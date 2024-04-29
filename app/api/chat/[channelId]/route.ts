import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { ChatValidation } from "@/lib/validations/chat";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

interface Context {
  params: {
    channelId: string;
  };
}

export async function GET(req: Request, params: Context) {
  const { channelId } = params.params;
  try {
    const messages = await prisma.message.findMany({
      where: {
        channelId: channelId,
      },
      orderBy: {
        sequenceId: "asc",
      },
      include: {
        sender: true,
      },
    });
    return NextResponse.json({ messages }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "Could not get messages" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request, params: Context) {
  const { channelId } = params.params;
  const body = await req.json();

  const { senderId, text } = ChatValidation.parse(body);

  try {
    const newMessage = await prisma.message.create({
      data: {
        channelId: channelId,
        senderId: senderId,
        text: text,
      },
    });

    return NextResponse.json({ newMessage }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "Could not get chat" },
      { status: 500 },
    );
  }
}
