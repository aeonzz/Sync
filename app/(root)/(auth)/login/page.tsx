import SignInForm from "@/components/forms/sign-in";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import Spline from "@splinetool/react-spline";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, useRouter } from "next/navigation";
import Image from "next/image";
import loginImage from "@/public/static-images/prateek-katyal-xv7-GlvBLFw-unsplash.jpg";

const Login = async () => {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/home");
  }

  return (
    <section className="flex h-screen w-full items-center">
      {/* <Spline scene="https://prod.spline.design/T4SctGAVgvqrV65D/scene.splinecode" /> */}
      <div className="flex-1">
        <Image src={loginImage} alt="login image" width={600} height={600} objectFit="cover" />
      </div>
      <div className="flex h-screen w-full flex-1 items-center justify-center">
        <SignInForm />
      </div>
    </section>
  );
};

export default Login;
