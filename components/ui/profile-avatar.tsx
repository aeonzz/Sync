"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CurrentUser } from "@/types/user";
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
import { PenLine, X } from "lucide-react";
import { useState } from "react";
import ImageUploadDialog from "./image-upload-dialog";

interface ProfileAvatarProps {
  currentUser: CurrentUser;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ currentUser }) => {
  const profileImage = currentUser.avatarUrl
    ? currentUser.avatarUrl
    : undefined;
  const fullname = `${currentUser.StudentData.firstName} ${currentUser.StudentData.middleName.charAt(0).toUpperCase()} ${currentUser.StudentData.lastName}`;

  return (
    <div className="absolute -bottom-20 left-5 flex h-32 w-auto items-end space-x-3">
      <Dialog>
        <div className="relative">
          <DialogTrigger asChild>
            <Avatar className="group relative h-36 w-36 cursor-pointer border-4 border-background">
              <div className="absolute z-50 h-full w-full rounded-full bg-card/30 opacity-0 transition group-hover:opacity-100" />
              <AvatarImage
                src={profileImage}
                className="object-cover"
                alt={profileImage}
              />
              <AvatarFallback>
                {currentUser.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DialogTrigger>
        </div>
        {profileImage && (
          <DialogImage>
            <Image
              className="object-cover"
              src={profileImage}
              alt="Cover Photo"
              width={500}
              height={500}
              quality={100}
            />
          </DialogImage>
        )}
      </Dialog>
      <div className="mb-5">
        <h2 className="inline-flex items-center gap-3 text-4xl font-semibold">
          {currentUser.username}
        </h2>
        <h4 className="text-muted-foreground">{fullname}</h4>
        <h4 className="text-muted-foreground">
          {currentUser.StudentData.department}
        </h4>
      </div>
    </div>
  );
};

export default ProfileAvatar;
