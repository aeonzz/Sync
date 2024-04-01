"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ResetPasswordValidation } from "@/lib/validations/user";
import { useState } from "react";
import { resetPassword } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ChangePasswordFormProps {
  userId: string;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  userId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()
  const form = useForm<z.infer<typeof ResetPasswordValidation>>({
    resolver: zodResolver(ResetPasswordValidation),
  });

  async function onSubmit(data: z.infer<typeof ResetPasswordValidation>) {
    setIsLoading(true)
    const response = await resetPassword(userId, data.password)

    if (response.status === 200) {
      setIsLoading(false);
      toast.success("Password reset successful")
      router.push("/auth")
    } else {
      setIsLoading(false);
      toast.error("Uh oh! Something went wrong.", {
        description:
          "An error occurred while making the request. Please try again later",
      });
    }

  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-[330px] space-y-3 !mt-7">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your new password"
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
              <FormControl>
                <Input
                  placeholder="Re-Enter your new password"
                  type="password"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Reset</Button>
      </form>
    </Form>
  );
};

export default ChangePasswordForm;
