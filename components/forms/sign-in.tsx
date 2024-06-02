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
import { useState } from "react";
import { toast } from "sonner";
import { SignInValidation } from "@/lib/validations/user";
import { signIn } from "next-auth/react";
import Loader from "../loaders/loader";
import Link from "next/link";
import { Separator } from "../ui/separator";

const SignInForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof SignInValidation>>({
    resolver: zodResolver(SignInValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof SignInValidation>) => {
    setIsLoading(true);

    try {
      const signInData = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      if (signInData?.error) {
        setIsLoading(false);
        console.log(signInData.error);
        toast.error("Uh oh! Something went wrong.", {
          description: signInData.error,
        });
      } else if (signInData?.ok) {
        router.push("/home");
        router.refresh()
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("Uh oh! Something went wrong.", {
        description:
          "An error occurred while making the request. Please try again later",
      });
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="mail@example.com"
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
                  <Link
                    className="absolute right-0 top-2 text-xs text-blue-500 hover:underline"
                    href="/auth/reset-password"
                  >
                    Forgot password?
                  </Link>
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
            {isLoading ? null : <p>Login</p>}
          </Button>
          <Separator className="mb-2 mt-4" />
          <div className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?
            <Link className="ml-1 text-blue-500 hover:underline" href="/auth/sign-up">
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
