import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const events = await prisma.event.findMany({
      where: {
        deleted: false,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        organizer: true,
        reservation: true,
      },
    });

    const venues = await prisma.venue.findMany();

    return NextResponse.json({ data: { events, venues } }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "could not get post" },
      { status: 500 },
    );
  }
}
