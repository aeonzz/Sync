import SignUpForm from "@/components/forms/sign-up";
import BackButton from "@/components/ui/back-button";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const SignUp = async () => {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/home");
  }

  return (
    <section className="relative flex h-screen w-full items-center">
      {/* <Spline scene="https://prod.spline.design/T4SctGAVgvqrV65D/scene.splinecode" /> */}
      <div className="flex h-screen w-full flex-1 items-center justify-center">
        <SignUpForm />
      </div>
    </section>
  );
};

export default SignUp;
