"use server";

import { Resend } from "resend";
import prisma from "../db";
import crypto from "crypto";
import { EmailTemplate } from "@/components/email-templates/email-template";
import ResetPasswordTemplate from "@/components/email-templates/reset-password-template";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendResetToken(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    const resetPasswordToken = crypto.randomBytes(32).toString("base64url");
    const today = new Date();
    const expiryDate = new Date(today.setDate(today.getDate() + 1));

    await prisma.user.update({
      where: {
        id: user?.id,
      },
      data: {
        resetPasswordToken,
        resetPasswordTokenExpiry: expiryDate,
      },
    });

    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Hello world",
      text: "aahah",
      react: ResetPasswordTemplate({ email, resetPasswordToken }),
    });

    return { error: null, status: 200 };
  } catch (error: any) {
    return { error: error.message, status: 200 };
  }
}
