import prisma from "@/lib/db";
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
      }
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