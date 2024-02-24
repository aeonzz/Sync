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
import axios from "axios";
import { User } from "@prisma/client";
// import { UpdateUser } from '@/types/update-user';
import { toast } from "sonner";
import * as z from "zod";
import { UpdateUser } from "@/types/user";
import { useRouter } from "next/navigation";
import {
  getStudentData,
  updateStudentData,
} from "@/lib/actions/student.actions";
import Loader from "../loaders/loader";
import { cn } from "@/lib/utils";
import { SignUpValidation } from "@/lib/validations/user";

const SignUpForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [idData, setIdData] = useState<{
    id: number;
    studentId: number;
    name: string;
    yearLevel: string;
    department: string;
    hasAccount: boolean;
  } | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof SignUpValidation>>({
    resolver: zodResolver(SignUpValidation),
    defaultValues: {
      username: "",
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
        toast.error("Invalid ID", {
          description: "Invalid characters in Student ID",
        });
        return;
      }
    }
    const studentIdInt: number = +studentId;
    const idData = await getStudentData(studentIdInt);
    setIdData(idData);

    if (idData === null) {
      toast.error("Student ID Verification Failed", {
        description:
          "Student ID not found in our systems. Please check your ID and try again.",
      });
    } else if (idData.hasAccount) {
      toast.error("Student ID Verification Failed", {
        description: "This ID already has an associated account.",
      });
    } else {
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
          username: values.username,
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
            name: idData?.name,
            yearLevel: idData?.yearLevel,
            department: idData?.department,
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your username"
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
            name="studentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student ID</FormLabel>
                <div className="flex items-center">
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
                    size="sm"
                    variant="secondary"
                    className={cn(isValid && "bg-green-500", "w-32")}
                  >
                    {isValid && <Check />}
                    {isValid ? <p>Verified</p> : <p>Check ID</p>}
                  </Button>
                </div>
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
          className="mt-6 w-full"
          type="submit"
          disabled={isLoading || !isValid}
        >
          {isLoading && <Loader />}
          {isLoading ? null : <p>Sign up</p>}
        </Button>
      </form>
    </Form>
  );
};

export default SignUpForm;
