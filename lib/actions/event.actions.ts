"use server";

import { AccessibilityType } from "@prisma/client";
import getBase64 from "../base64";
import prisma from "../db";

interface CreateEventParams {
  image: string | undefined;
  userId: string;
  description: string;
  name: string;
  date: Date;
  location: string;
  accessibility: AccessibilityType;
}

export async function createEvent({
  image,
  userId,
  description,
  name,
  date,
  location,
  accessibility,
}: CreateEventParams) {
  try {
    let blurDataUrl;
    if (image) {
      blurDataUrl = await getBase64(image);
    }

    await prisma.event.create({
      data: {
        organizerId: userId,
        description,
        name,
        date,
        location,
        accessibility,
        image: image,
        blurDataUrl,
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