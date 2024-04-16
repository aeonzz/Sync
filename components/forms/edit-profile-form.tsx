"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import * as z from "zod";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { OnboardingValidation } from "@/lib/validations/user";
import { Textarea } from "../ui/textarea";
import { useEffect, useState } from "react";
import { UserProps } from "@/types/user";
import { SingleImageDropzone } from "./single-image";
import { useEdgeStore } from "@/lib/edgestore";
import { updateUser } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";
import Loader from "../loaders/loader";
import Banners from "../ui/banners";

interface EditProfileFormProps {
  userData: UserProps;
  setOpen: (state: boolean) => void;
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({
  userData,
  setOpen,
  isLoading,
  setIsLoading,
}) => {

  const form = useForm<z.infer<typeof OnboardingValidation>>({
    resolver: zodResolver(OnboardingValidation),
    defaultValues: {
      username: userData.username ? userData.username : "",
      bio: userData.bio ? userData.bio : "",
    },
  });

  const profileCover = userData.coverUrl
    ? userData.coverUrl
    : "https://jolfgowviyxdrvtelayh.supabase.co/storage/v1/object/public/static%20images/nat-cXuvDkzEJdE-unsplash.jpg";
  const profileAvatar = userData.avatarUrl
    ? userData.avatarUrl
    : "https://jolfgowviyxdrvtelayh.supabase.co/storage/v1/object/public/static%20images/no-image.jpg";
  const { edgestore } = useEdgeStore();
  const router = useRouter();
  const [coverFile, setCoverFile] = useState<File>();
  const [avatarFile, setAvatarFile] = useState<File>();
  const [banner, setBanner] = useState<string>();

  async function onSubmit(data: z.infer<typeof OnboardingValidation>) {
    console.log(data)
    setIsLoading(true);

    let coverRes;
    if (coverFile) {
      try {
        coverRes = await edgestore.publicImages.upload({
          file: coverFile,
        });
      } catch (error) {
        setIsLoading(false);
        toast.error("Uh oh! Something went wrong.", {
          description: "Could not upload photo, Try again later.",
        });
      }
    }

    let avatarRes;
    if (avatarFile) {
      try {
        avatarRes = await edgestore.publicImages.upload({
          file: avatarFile,
        });
      } catch (error) {
        setIsLoading(false);
        toast.error("Uh oh! Something went wrong.", {
          description: "Could not upload photo, Try again later.",
        });
      }
    }

    const userEditData = {
      ...data,
      userId: userData.id,
      coverUrl: banner ? banner : coverRes?.url,
      avatarUrl: avatarRes?.url,
      onboarded: true,
    };
    const result = await updateUser(userEditData);

    if (result.status === 200) {
      setOpen(false);
      setIsLoading(false);
      router.refresh();
      toast("Profile successfully updated");
      setIsLoading(false);
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="relative">
          <SingleImageDropzone
            width={464}
            height={160}
            removeIcon={true}
            className="rounded-md bg-secondary"
            disabled={isLoading}
            value={coverFile ? coverFile : profileCover}
            onChange={(coverFile) => {
              setCoverFile(coverFile);
            }}
          />
          <div className="absolute -bottom-20 left-4 rounded-full border-4 border-background">
            <SingleImageDropzone
              width={160}
              height={160}
              removeIcon={true}
              className="aspect-square rounded-full bg-secondary"
              disabled={isLoading}
              value={avatarFile ? avatarFile : profileAvatar}
              onChange={(avatarFile) => {
                setAvatarFile(avatarFile);
              }}
            />
          </div>
          <Banners setBanner={setBanner} />
        </div>
        <div className="w-full space-y-2 pt-12">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="This is your public display name."
                    autoComplete="off"
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
                    className="resize-none focus-visible:ring-1 focus-visible:ring-offset-1"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="-bottom-5" />
              </FormItem>
            )}
          />
        </div>
        <div className="mt-5 flex w-full space-x-3">
          <Button
            disabled={isLoading}
            variant="ghost"
            className="flex-1"
            onClick={(e) => {
              e.preventDefault();
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button className="flex-1" type="submit" disabled={isLoading}>
            {isLoading && <Loader />}
            {isLoading ? null : <p>Confirm</p>}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditProfileForm;
