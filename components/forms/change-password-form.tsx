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
import Loader from "../loaders/loader";

interface ChangePasswordFormProps {
  resetPasswordToken: string;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  resetPasswordToken,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof ResetPasswordValidation>>({
    resolver: zodResolver(ResetPasswordValidation),
  });

  async function onSubmit(data: z.infer<typeof ResetPasswordValidation>) {
    setIsLoading(true);
    const response = await resetPassword(resetPasswordToken, data.password);

    if (response.status === 200) {
      setIsLoading(false);
      toast.success("Success", {
        description: "Password reset successful",
      });
      router.push("/auth");
    } else {
      setIsLoading(false);
      toast.error("Uh oh! Something went wrong.", {
        description: response.error,
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-[330px] space-y-3"
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
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
              <FormLabel>Re-Enter your password</FormLabel>
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
        <Button type="submit" className="!mt-5 w-full" disabled={isLoading}>
          {isLoading && <Loader />}
          {!isLoading && "Reset"}
        </Button>
      </form>
    </Form>
  );
};

export default ChangePasswordForm;
