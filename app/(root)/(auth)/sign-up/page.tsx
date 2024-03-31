import SignUpForm from "@/components/forms/sign-up";
import { buttonVariants } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { getServerSession } from "next-auth";
import Link from "next/link";
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
      <Link
        href="/login"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-5 top-5 z-50",
        )}
      >
        Log in
      </Link>
      {/* <div className="flex-1 border border-white"></div> */}
      <div className="flex h-screen w-full flex-1 items-center justify-center">
        <SignUpForm />
      </div>
    </section>
  );
};

export default SignUp;
