"use server";

import { getServerSession } from "next-auth";
import prisma from "../db";
import { authOptions } from "../auth";
import { boolean } from "zod";

export async function getStudentData(studentId: number) {
  try {
    const response = await prisma.studentData.findFirst({
      where: {
        studentId: studentId,
      },
    });

    return response;
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

interface Params {
  id: number;
  name: string;
  yearLevel: string;
  department: string;
  hasAccount: boolean;
}

export async function updateStudentData({
  id,
  name,
  yearLevel,
  department,
  hasAccount,
}: Params) {
  try {
    const updateData: Record<string, unknown> = {};
    if (name !== undefined) {
      updateData.name = name;
    }
    if (yearLevel !== undefined) {
      updateData.yearLevel = yearLevel;
    }
    if (department !== undefined) {
      updateData.department = department;
    }
    if (hasAccount !== undefined) {
      updateData.hasAccount = hasAccount;
    }
    const response = await prisma.studentData.update({
      where: { id: id },
      data: updateData,
    });
    return response;
  } catch (error: any) {
    console.log(error)
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}
