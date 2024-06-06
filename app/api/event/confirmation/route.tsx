import prisma from "@/lib/db";
import { ApprovalStatusType, EventStatusType } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const confirmations = await prisma.event.findMany({
      where: {
        approvalStatus: ApprovalStatusType.PENDING,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        organizer: true,
        reservation: true,
      },
    });

    return NextResponse.json({ data: confirmations }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "could not get post" },
      { status: 500 },
    );
  }
}
