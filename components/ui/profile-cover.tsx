"use client";

import loginImage from "@/public/static-images/prateek-katyal-xv7-GlvBLFw-unsplash.jpg";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogImage,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "./button";
import { useState } from "react";
import ImageUploadDialog from "./image-upload-dialog";
import { CurrentUser } from "@/types/user";

interface ProfileCoverProps {
  currentUser: CurrentUser;
}

const ProfileCover: React.FC<ProfileCoverProps> = ({ currentUser }) => {
  const profileCover = currentUser.coverUrl
    ? currentUser.coverUrl
    : "https://jolfgowviyxdrvtelayh.supabase.co/storage/v1/object/public/static%20images/nat-cXuvDkzEJdE-unsplash.jpg";

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Image
            fill
            className="cursor-pointer rounded-lg object-cover object-center"
            src={profileCover}
            alt="cover photo"
            quality={100}
          />
        </DialogTrigger>
        <DialogImage>
          <Image
            className="object-cover"
            src={profileCover}
            alt="Cover Photo"
            width={1000}
            height={1000}
            quality={100}
          />
        </DialogImage>
      </Dialog>
    </>
  );
};

export default ProfileCover;
