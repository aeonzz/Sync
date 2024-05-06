import prisma from "@/lib/db";
import { ReactionValidation } from "@/lib/validations/chat";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const { messageId, reaction, userId } = ReactionValidation.parse(body);

  try {
    const newReaction = await prisma.messageReaction.create({
      data: {
        messageId,
        reaction,
        userId,
      },
    });

    return NextResponse.json({ newReaction }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "Could not get chat" },
      { status: 500 },
    );
  }
}
