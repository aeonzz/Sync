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
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import * as z from "zod";
import { useRouter } from "next/navigation";
import {
  getStudentDataById,
  updateStudentData,
} from "@/lib/actions/student.actions";
import Loader from "../loaders/loader";
import { cn } from "@/lib/utils";
import { SignUpValidation } from "@/lib/validations/user";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";

const SignUpForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [idData, setIdData] = useState<{
    id: number;
    studentId: number;
    firstName: string;
    middleName: string;
    lastName: string;
    yearLevel: string;
    department: string;
    hasAccount: boolean;
  } | null>(null);
  const router = useRouter();
  const fullname = idData?.firstName
    ? idData.firstName +
      " " +
      idData?.middleName.charAt(0).toUpperCase() +
      ". " +
      idData?.lastName
    : undefined;

  const form = useForm<z.infer<typeof SignUpValidation>>({
    resolver: zodResolver(SignUpValidation),
    defaultValues: {
      email: "",
      studentId: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleIdCheck = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const studentId = form.getValues("studentId");

    if (typeof studentId === "string") {
      if (!/^\d+$/.test(studentId)) {
        toast.warning("Invalid ID", {
          description: "Invalid characters",
        });
        return;
      }
    }
    const studentIdInt: number = +studentId;
    const idData = await getStudentDataById(studentIdInt);

    if (idData.error) {
      toast.error("Uh oh! Something went wrong.", {
        description:
          "An error occurred while making the request. Please try again later",
      });
    } else if (!idData.data) {
      toast.error("Student ID Verification Failed", {
        description:
          "Student ID not found in our systems. Please check your ID and try again.",
      });
    } else if (idData.data?.hasAccount) {
      toast.warning("Student ID Verification Failed", {
        description: "This ID already has an associated account.",
      });
    } else {
      setIdData(idData.data);
      setIsValid(true);
    }
  };

  const onSubmit = async (values: z.infer<typeof SignUpValidation>) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          studentId: values.studentId,
          password: values.password,
          confirmPassword: values.confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (idData) {
          await updateStudentData({
            id: idData?.id,
            hasAccount: true,
          });
        }
        toast.success("Registration Successful", {
          description: data.message,
        });
        router.push("/login");
      } else {
        setIsLoading(false);
        toast.error("Uh oh! Something went wrong.", {
          description: data.message,
        });
      }
    } catch (error) {
      setIsLoading(false);

      console.error("An error occurred while making the request:", error);

      toast.error("Uh oh! Something went wrong.", {
        description: "An error occurred while making the request.",
      });
    }
  };

  return (
    <div className="relative w-[380px] px-10 py-16">
      <div className="absolute left-[31%] top-0 flex items-center">
        <div className="relative text-center text-xs">
          <p className="absolute -left-1 -top-7">Verify</p>
          <div
            className={cn(
              isValid ? "bg-input" : "bg-primary",
              "inline-flex h-6 w-6 items-center justify-center rounded-full border",
            )}
          >
            1
          </div>
        </div>
        <Separator className="w-24" />
        <div className="relative text-xs">
          <p className="absolute -left-2 -top-7 w-40">Sign up</p>
          <div
            className={cn(
              isValid ? "bg-primary" : "bg-input",
              "borde inline-flex h-6 w-6 items-center justify-center rounded-full text-xs",
            )}
          >
            2
          </div>
        </div>
      </div>
      <div className="mb-7">
        <h2 className="text-center text-2xl font-semibold tracking-tight">
          Create an account
        </h2>
        <p className="text-center text-sm text-muted-foreground">
          Enter your credentials below to create your account
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          {isValid ? (
            <>
              <div className="space-y-2">
                {fullname && (
                  <Card className="p-4">
                    <h4 className="scroll-m-20 text-sm font-semibold tracking-tight">
                      Welcome,{" "}
                      <span className="text-muted-foreground">{fullname}</span>
                    </h4>
                  </Card>
                )}
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
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Re-Enter your password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Re-Enter your password"
                          type="password"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                className="mt-5 w-full"
                type="submit"
                disabled={isLoading}
              >
                {isLoading && <Loader />}
                {isLoading ? null : <p>Signup</p>}
              </Button>
            </>
          ) : (
            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center space-x-3">
                    <FormControl>
                      <Input
                        placeholder="Enter your student id"
                        disabled={isLoading || isValid}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={10}
                        {...field}
                      />
                    </FormControl>
                    <Button
                      onClick={(e) => handleIdCheck(e)}
                      disabled={isLoading || isValid}
                      variant="secondary"
                      className="w-32"
                    >
                      {isValid && <Check className="mr-1 h-5 w-5" />}
                      {isValid ? <p>Verified</p> : <p>Verify</p>}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </form>
      </Form>
    </div>
  );
};

export default SignUpForm;
