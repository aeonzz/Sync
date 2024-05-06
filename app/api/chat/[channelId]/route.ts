import prisma from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { ChatValidation } from "@/lib/validations/chat";
import { NextResponse } from "next/server";

interface Context {
  params: {
    channelId: string;
  };
}

export async function GET(req: Request, params: Context) {
  const { channelId } = params.params;
  const url = new URL(req.url);
  const cursorParam = url.searchParams.get("cursor");
  const cursor = cursorParam ? parseInt(cursorParam, 10) : undefined;

  try {
    const messages = await prisma.message.findMany({
      where: {
        channelId: channelId,
        sequenceId: cursor ? { lt: cursor } : undefined,
      },
      orderBy: {
        sequenceId: "desc",
      },
      include: {
        sender: true,
        messageReaction: {
          include: {
            user: true,
          },
        },
      },
      take: 40,
    });
    const lastMessage = messages[messages.length - 1];
    const nextCursor = lastMessage?.sequenceId || undefined;

    return NextResponse.json({ messages, nextCursor }, { status: 200 });
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
      include: {
        sender: true,
      },
    });

    pusherServer.trigger("messages", "incoming-message", newMessage);

    return NextResponse.json({ newMessage }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "Could not get chat" },
      { status: 500 },
    );
  }
}
