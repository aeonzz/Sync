import prisma from "@/lib/db";
import { ApprovalStatusType, EventStatusType } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const venues = await prisma.venue.findMany({
      include: {
        events: {
          where: {
            approvalStatus: ApprovalStatusType.APPROVED,
            eventStatus: EventStatusType.UPCOMING,
          },
          include: {
            reservation: true,
          },
        },
      },
    });

    return NextResponse.json({ data: venues }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "could not get post" },
      { status: 500 },
    );
  }
}
