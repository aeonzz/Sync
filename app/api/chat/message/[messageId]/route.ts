import prisma from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { ReactionValidation } from "@/lib/validations/chat";
import { NextResponse } from "next/server";

interface Context {
  params: {
    messageId: string;
  };
}

export async function GET(req: Request, params: Context) {
  const { messageId } = params.params;

  try {
    const reactions = await prisma.messageReaction.findMany({
      where: {
        messageId,
      },
    });

    return NextResponse.json({ reactions }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "Could not get chat" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request, params: Context) {
  const { messageId } = params.params;
  const body = await req.json();

  const { reaction, userId } = ReactionValidation.parse(body);

  try {
    const newReaction = await prisma.messageReaction.create({
      data: {
        messageId,
        reaction,
        userId,
      },
    });

    pusherServer.trigger("message-reaction", "incoming-reaction", newReaction);

    return NextResponse.json({ newReaction }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "Could not get chat" },
      { status: 500 },
    );
  }
}
