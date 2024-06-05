import prisma from "@/lib/db";
import { SignUpValidation } from "@/lib/validations/user";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";

export async function POST(req: Request) {
  const body = await req.json();
  const { studentId, email, password } = SignUpValidation.parse(body);
  const studentIdInt: number = +studentId;

  try {
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { user: null, message: "Email already exists" },
        { status: 409 },
      );
    }

    const existingUserByStudentID = await prisma.user.findUnique({
      where: {
        studentId: studentIdInt,
      },
    });

    if (existingUserByStudentID) {
      return NextResponse.json(
        { user: null, message: "ID already exists" },
        { status: 409 },
      );
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        studentId: studentIdInt,
        password: hashedPassword,
      },
    });

    const { password: newUserPassword, ...rest } = newUser;

    return NextResponse.json(
      { user: rest, message: "User created successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "An internal server error occurred" },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  try {
    const users = await prisma.user.findMany();

    return NextResponse.json({ data: users }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "could not get post" },
      { status: 500 },
    );
  }
}
