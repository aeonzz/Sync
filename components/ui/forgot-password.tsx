"use client";

import { useState } from "react";
import ForgotPasswordForm from "../forms/forgot-password-form";

const ForgotPassword = () => {
  const [isEmailSent, setIsEmailSent] = useState(false);

  return (
    <>
      {isEmailSent ? (
        <>
          <h1 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Reset Email Sent
          </h1>
          <p className="text-center text-sm text-muted-foreground">
            Reset email sent! Please check your inbox for further instructions.
          </p>
        </>
      ) : (
        <>
          <h1 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Forgot Password?
          </h1>
          <p className="text-center text-sm text-muted-foreground">
            No worries, we can help! Enter the email address associated with
            your account and click the "Reset Password" button below.
            <br /> We'll send you a link to reset your password.
          </p>
          <ForgotPasswordForm setIsEmailSent={setIsEmailSent} />
        </>
      )}
    </>
  );
};

export default ForgotPassword;
