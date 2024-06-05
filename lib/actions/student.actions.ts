"use server";

import { DepartmentType, YearLevel } from "@prisma/client";
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

interface CreateStudentParams {
  studentId: number;
  firstName: string;
  middleName: string;
  lastName: string;
  section: string;
  yearLevel: YearLevel;
  department: DepartmentType;
}

export async function createStudent({
  studentId,
  firstName,
  middleName,
  lastName,
  section,
  yearLevel,
  department,
}: CreateStudentParams) {
  try {
    const existingStudentById = await prisma.studentData.findUnique({
      where: {
        studentId,
      },
    });

    if (existingStudentById) {
      return { exist: true, message: "Student Id already exist", status: 409 };
    }
    const sectionUpperCase = section.toUpperCase();

    await prisma.studentData.create({
      data: {
        studentId,
        firstName,
        middleName,
        lastName,
        section: sectionUpperCase,
        yearLevel,
        department,
      },
    });
    return { error: null, message: "Student created successfuly", status: 200 };
  } catch (error: any) {
    console.log(error);
    return { error: error.message, message: "Error", status: 500 };
  }
}
