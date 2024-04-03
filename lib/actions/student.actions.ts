"use server";

import prisma from "../db";

export async function getStudentDataById(studentId: number) {
  try {
    const response = await prisma.studentData.findFirst({
      where: {
        studentId: studentId,
      },
    });

    return { data: response, error: null, status: 200 };
  } catch (error: any) {
    return { data: null, error: error.message, status: 500 };
  }
}

interface updateStudentDataParams {
  id: number;
  hasAccount: boolean;
}

export async function updateStudentData({
  id,
  hasAccount,
}: updateStudentDataParams) {
  try {
    await prisma.studentData.update({
      where: { id: id },
      data: {
        hasAccount,
      },
    });
    return { error: null, status: 200 };
  } catch (error: any) {
    console.log(error);
    return { error: error.message, status: 500 };
  }
}
