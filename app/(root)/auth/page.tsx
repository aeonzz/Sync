import SignInForm from "@/components/forms/sign-in";
import { buttonVariants } from "@/components/ui/button";
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const Login = async () => {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/home");
  }

  return (
    <section className="flex h-screen w-full items-center">
      {/* <Spline scene="https://prod.spline.design/T4SctGAVgvqrV65D/scene.splinecode" /> */}
      {/* <div className="flex-1 relative h-screen">
        <Image src={loginImage} alt="login image" fill objectFit="cover" />
      </div> */}
      <div className="flex h-screen w-full flex-1 items-center justify-center">
        <SignInForm />
      </div>
    </section>
  );
};

export default Login;
