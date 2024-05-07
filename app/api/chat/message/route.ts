import prisma from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { ReactionValidation } from "@/lib/validations/chat";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const { reaction, userId } = ReactionValidation.parse(body);
  const messageId = "asda";
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
