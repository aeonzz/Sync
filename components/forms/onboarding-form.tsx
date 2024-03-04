"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { OnboardingValidation } from "@/lib/validations/user";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { Plus, X } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { useState } from "react";
import Loader from "../loaders/loader";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useSession } from "next-auth/react";
import { SingleImageDropzone } from "./single-image";
import { useEdgeStore } from "@/lib/edgestore";
import { UserType } from "@/types/user";
import { useRouter } from "next/navigation";

const OnboardingForm = () => {
  const currentUser = useSession();
  const router = useRouter();
  const userId = currentUser.data?.user.id;
  const [file, setFile] = useState<File>();
  const { edgestore } = useEdgeStore();
  const initialLetter = currentUser.data?.user.username
    ?.charAt(0)
    .toUpperCase();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof OnboardingValidation>>({
    resolver: zodResolver(OnboardingValidation),
    defaultValues: {
      displayName: "",
      bio: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "urls",
    control: form.control,
  });

  const { mutate: onboarding } = useMutation({
    mutationFn: (onboarding: UserType) => {
      return axios.post(`/api/user/${userId}`, onboarding);
    },
    onError: (error) => {
      console.log(error);
      setIsLoading(false);
      toast.error("Uh oh! Something went wrong.", {
        description: "There is a server error, Try again later.",
      });
    },
    onSuccess: () => {
      router.push("/home")
    },
  });

  async function onSubmit(data: z.infer<typeof OnboardingValidation>) {
    setIsLoading(true);
    let res;
    if (file) {
      try {
        res = await edgestore.publicImages.upload({
          file,
        });
      } catch (error) {
        toast.error("Uh oh! Something went wrong.", {
          description: "Could not upload photo, Try again later.",
        });
      }
    }

    const userData: UserType = {
      ...data,
      avatarUrl: res?.url,
      onboarded: true,
    };
    onboarding(userData);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="flex items-center space-x-4">
          <SingleImageDropzone
            width={160}
            height={150}
            value={file}
            onChange={(file) => {
              setFile(file);
            }}
          />
          <div className="w-full space-y-3">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="This is your public display name."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="-bottom-5" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about yourself"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="-bottom-5" />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="space-y-2">
          <FormLabel>URLs</FormLabel>
          <div className="flex items-center justify-between">
            <FormDescription>
              Add links to your website, blog, or social media profiles.
            </FormDescription>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => append({ value: "" })}
            >
              <Plus className="mr-1 h-4 w-4" />
              Add URL
            </Button>
          </div>
          <ScrollArea
            className={cn(
              fields.length !== 0 ? "h-20" : "",
              "w-full rounded-md",
            )}
          >
            {fields.map((field, index) => (
              <div key={field.id} className="mb-4 flex items-center space-x-2">
                <FormField
                  control={form.control}
                  name={`urls.${index}.value`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage className="-bottom-4" />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => remove(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </ScrollArea>
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader />}
          {isLoading ? null : <p>Confirm</p>}
        </Button>
      </form>
    </Form>
  );
};

export default OnboardingForm;
