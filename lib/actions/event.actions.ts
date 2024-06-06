"use server";

import {
  AccessibilityType,
  ApprovalStatusType,
  EventStatusType,
} from "@prisma/client";
import getBase64 from "../base64";
import prisma from "../db";

interface CreateEventParams {
  image: string | undefined;
  userId: string;
  description: string;
  name: string;
  location: string;
  accessibility: AccessibilityType;
  venueId: string;
  startTime: Date;
  endTime: Date;
}

export async function createEvent({
  image,
  userId,
  description,
  name,
  location,
  accessibility,
  venueId,
  startTime,
  endTime,
}: CreateEventParams) {
  try {
    let blurDataUrl;
    if (image) {
      blurDataUrl = await getBase64(image);
    }

    const event = await prisma.event.create({
      data: {
        organizerId: userId,
        description,
        name,
        location,
        accessibility,
        image: image,
        blurDataUrl,
        venueId,
      },
    });

    await prisma.reservation.create({
      data: {
        eventId: event.id,
        startTime,
        endTime,
      },
    });

    return { error: null, status: 200 };
  } catch (error: any) {
    console.log(error);
    return { error: error.message, status: 500 };
  }
}

export async function deleteEvent(eventId: string) {
  try {
    await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        deleted: true,
      },
    });
    return { error: null, status: 200 };
  } catch (error: any) {
    console.log(error);
    return { error: error.message, status: 500 };
  }
}

interface UpdateEventParams {
  eventId: string;
  name: string;
  description: string;
  accessibility: AccessibilityType;
  location: string;
  startTime: Date;
  endTime: Date;
}

export async function updateEvent({
  eventId,
  name,
  description,
  accessibility,
  location,
  startTime,
  endTime,
}: UpdateEventParams) {
  try {
    await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        name,
        description,
        accessibility,
        location,
      },
    });

    await prisma.reservation.update({
      where: {
        eventId,
      },
      data: {
        startTime,
        endTime,
      },
    });

    return { error: null, status: 200 };
  } catch (error: any) {
    console.log(error);
    return { error: error.message, status: 500 };
  }
}

export async function updateEventStatus(
  eventId: string,
  status: EventStatusType,
) {
  try {
    await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        eventStatus: status,
      },
    });
    return { error: null, status: 200 };
  } catch (error: any) {
    console.log(error);
    return { error: error.message, status: 500 };
  }
}

export async function updateApprovalStatus(
  eventID: string,
  stats: ApprovalStatusType,
) {
  try {
    await prisma.event.update({
      where: {
        id: eventID,
      },
      data: {
        approvalStatus: stats,
      },
    });
    return { error: null, status: 200 };
  } catch (error: any) {
    console.log(error);
    return { error: error.message, status: 500 };
  }
}
