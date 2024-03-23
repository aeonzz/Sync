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
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { SingleImageDropzone } from "./single-image";
import { useEdgeStore } from "@/lib/edgestore";
import { useRouter } from "next/navigation";
import { updateUser } from "@/lib/actions/user.actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const OnboardingForm = () => {
  const session = useSession();
  const router = useRouter();
  const userId = session.data?.user.id;
  const [file, setFile] = useState<File>();
  const { edgestore } = useEdgeStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const form = useForm<z.infer<typeof OnboardingValidation>>({
    resolver: zodResolver(OnboardingValidation),
    defaultValues: {
      username: "",
      bio: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "urls",
    control: form.control,
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
        setIsLoading(false);
        toast.error("Uh oh! Something went wrong.", {
          description: "Could not upload photo, Try again later.",
        });
      }
    }

    const userData = {
      ...data,
      userId: userId!,
      avatarUrl: res?.url,
      onboarded: true,
    };
    const result = await updateUser(userData);

    if (result.status === 200) {
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/home");
        router.refresh();
      }, 1000);
    } else {
      setIsLoading(false);
      toast.error("Uh oh! Something went wrong.", {
        description:
          "An error occurred while making the request. Please try again later",
      });
    }
  }

  return (
    <div
      className={cn(
        isSuccess ? "opacity-0" : "opacity-100",
        "transition-opacity duration-700",
      )}
    >
      <CardHeader>
        <CardTitle>Onboarding.</CardTitle>
        <CardDescription>
          Complete your profile now, to use Sync.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <div className="flex items-center space-x-10">
              <SingleImageDropzone
                width={160}
                height={160}
                value={file}
                className="aspect-square rounded-full"
                onChange={(file) => {
                  setFile(file);
                }}
              />
              <div className="w-full space-y-3">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="This is your public display name."
                          disabled={isLoading}
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
                          disabled={isLoading}
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
                  <div
                    key={field.id}
                    className="mb-4 flex items-center space-x-2"
                  >
                    <FormField
                      control={form.control}
                      name={`urls.${index}.value`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input {...field} disabled={isLoading} />
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
      </CardContent>
    </div>
  );
};

export default OnboardingForm;
