"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SignInValidation } from "@/lib/validations/user";
import { signIn } from "next-auth/react";
import Loader from "../loaders/loader";
import { Card } from "../ui/card";
import Link from "next/link";
import { Separator } from "../ui/separator";

const SignInForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof SignInValidation>>({
    resolver: zodResolver(SignInValidation),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof SignInValidation>) => {
    setIsLoading(true);

    const signInData = await signIn("credentials", {
      username: values.username,
      password: values.password,
      redirect: false,
    });

    if (signInData?.error) {
      setIsLoading(false);
      toast.error("Uh oh! Something went wrong.", {
        description: signInData.error,
      });
    } else {
      router.push("/onboarding");
      router.refresh();
    }
  };

  return (
    <div className="relative w-[380px] p-10">
      <div className="mb-7">
        <h2 className="text-center text-2xl font-semibold tracking-tight">
          Welcome to Sync
        </h2>
        <p className="text-center text-sm text-muted-foreground">
          Enter your credentials below to login to your account
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your username"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button className="mt-5 w-full" type="submit" disabled={isLoading}>
            {isLoading && <Loader />}
            {isLoading ? null : <p>Log in</p>}
          </Button>
          <Separator className="mb-2 mt-4" />
          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?
            <Link className="underline text-blue-500 ml-1" href="/register">
              Register here
            </Link>
          </div>
        </form>

        {/* <p className='text-center text-sm text-gray-600 mt-2'>
          If you don&apos;t have an account, please&nbsp;
          <Link className='text-blue-500 hover:underline' href='/sign-up'>
            Sign up
          </Link>
        </p> */}
      </Form>
    </div>
  );
};

export default SignInForm;
