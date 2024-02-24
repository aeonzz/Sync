"use server";

import { getServerSession } from "next-auth";
import prisma from "../db";
import { authOptions } from "../auth";


export async function getUser() {
  const session = await getServerSession(authOptions);
  try {
    const response = await prisma.user.findFirst({
      where: {
        id: session?.user.id,
      },
    });

    return response;
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}
