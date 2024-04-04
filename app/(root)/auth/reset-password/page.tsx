import ChangePasswordForm from "@/components/forms/change-password-form";
import BackButton from "@/components/ui/back-button";
import ForgotPassword from "@/components/ui/forgot-password";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

interface ResetPasswordPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = async ({
  searchParams,
}) => {

  if (searchParams.token) {
    const user = await prisma.user.findUnique({
      where: {
        resetPasswordToken: searchParams.token as string,
      },
    });

    if (!user)
      return (
        <h1 className="tracking-tightl scroll-m-20 text-center text-2xl font-semibold">
          Invalid token
        </h1>
      );
    const resetPasswordTokenExpiry = user.resetPasswordTokenExpiry;
    if (!resetPasswordTokenExpiry)
      return (
        <h1 className="tracking-tightl scroll-m-20 text-center text-2xl font-semibold">
          Invalid token
        </h1>
      );
    const today = new Date();
    const isTokenExpired = today > resetPasswordTokenExpiry;
    if (isTokenExpired)
      return (
        <h1 className="tracking-tightl scroll-m-20 text-center text-2xl font-semibold">
          Token expired
        </h1>
      );

    return (
      <>
        <h1 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Reset Your Password
        </h1>
        <p className="text-center text-sm text-muted-foreground">
          Please enter your new password and confirm it to complete the reset
          process.
        </p>
        <ChangePasswordForm resetPasswordToken={searchParams.token as string} />
      </>
    );
  } else {
    return (
      <ForgotPassword />
    );
  }
};

export default ResetPasswordPage;
