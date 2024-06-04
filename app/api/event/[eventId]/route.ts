import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

interface Context {
  params: {
    eventId: string;
  };
}

export async function GET(req: Request, params: Context) {
  const { eventId } = params.params;
  const session = await getServerSession(authOptions);

  try {
    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
      },
      include: {
        organizer: {
          include: {
            studentData: true,
          },
        },
        reservation: true,
        venue: true,
        eventAttendee: {
          include: {
            user: {
              include: {
                studentData: true,
              },
            },
          },
        },
      },
    });

    const checkUserAttended = await prisma.eventAttendee.findFirst({
      where: {
        eventId: event?.id,
        userId: session?.user.id,
      },
    });

    return NextResponse.json(
      { data: { event: event, isJoined: checkUserAttended !== null } },
      { status: 200 },
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "could not get post" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request, params: Context) {
  const { eventId } = params.params;
  const body = await req.json();

  try {
    const newAttendee = await prisma.eventAttendee.create({
      data: {
        eventId,
        userId: body.userId,
      },
    });
    return NextResponse.json({ data: newAttendee }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "could not get post" },
      { status: 500 },
    );
  }
}
