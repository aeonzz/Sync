import prisma from "@/lib/db";
import { ApprovalStatusType, EventStatusType } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const events = await prisma.event.findMany({
      where: {
        deleted: false,
        OR: [
          {
            approvalStatus: ApprovalStatusType.PENDING,
          },
          {
            approvalStatus: ApprovalStatusType.APPROVED,
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        organizer: true,
        reservation: true,
      },
    });

    return NextResponse.json({ data: events }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "could not get post" },
      { status: 500 },
    );
  }
}
