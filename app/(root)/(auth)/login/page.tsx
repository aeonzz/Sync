import SignInForm from "@/components/forms/sign-in";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import Spline from "@splinetool/react-spline";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, useRouter } from "next/navigation";

const Login = async () => {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/home");
  }

  return (
    <section className="relative flex h-screen w-full items-center justify-center">
      {/* <Spline scene="https://prod.spline.design/T4SctGAVgvqrV65D/scene.splinecode" /> */}
      <Link
        href="/sign-up"
        className={cn(
          buttonVariants({ variant: "link" }),
          "absolute right-5 top-5 text-xs text-blue-500 z-50",
        )}
      >
        Siginup
      </Link>
      <div className="absolute flex h-screen w-full items-center justify-center">
        <SignInForm />
      </div>
    </section>
  );
};

export default Login;
