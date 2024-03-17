"use server";

import prisma from "../db";

export async function getStudentData(studentId: number) {
  try {
    const response = await prisma.studentData.findFirst({
      where: {
        studentId: studentId,
      },
    });

    return { data: response, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

interface Params {
  id: number;
  hasAccount: boolean;
}

export async function updateStudentData({ id, hasAccount }: Params) {
  try {
    const updateData = { hasAccount };

    const response = await prisma.studentData.update({
      where: { id: id },
      data: updateData,
    });
    return { data: response, error: null, status: 200 };
  } catch (error: any) {
    console.log(error);
    return { data: null, error: error.message, status: 500 };
  }
}
