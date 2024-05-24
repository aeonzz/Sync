import prisma from "@/lib/db";
import { NextResponse } from "next/server";

interface Context {
  params: {
    eventId: string;
  };
}

export async function GET(req: Request, params: Context) {
  const { eventId } = params.params;

  try {
    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
      },
      include: {
        organizer: true,
        reservation: true,
        venue: true,
      },
    });
    
    const venues = await prisma.venue.findMany();

    return NextResponse.json({ data: { event, venues } }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "could not get post" },
      { status: 500 },
    );
  }
}
