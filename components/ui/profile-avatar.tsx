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
import { Separator } from "./separator";

interface ProfileAvatarProps {
  currentUser: CurrentUser;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ currentUser }) => {
  const profileImage = currentUser.avatarUrl
    ? currentUser.avatarUrl
    : undefined;
  const fullname = `${currentUser.StudentData.firstName} ${currentUser.StudentData.middleName.charAt(0).toUpperCase()} ${currentUser.StudentData.lastName}`;

  const [editModal, setEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [file, setFile] = useState<File | undefined>(undefined);

  return (
    <div className="absolute -bottom-20 left-5 flex h-32 w-auto items-end space-x-3">
      <Dialog>
        <div className="relative">
          <DialogTrigger asChild>
            <Avatar className="group relative h-36 w-36 cursor-pointer border-4 border-background">
              <div className="absolute z-50 h-full w-full rounded-full bg-card/30 opacity-0 transition group-hover:opacity-100" />
              <AvatarImage src={profileImage} className="object-cover" />
              <AvatarFallback>
                {currentUser.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DialogTrigger>
          <Button
            size="icon"
            variant="secondary"
            className="absolute bottom-0 right-1 rounded-full"
            onClick={() => setEditModal(true)}
          >
            <PenLine className="h-5 w-5" />
          </Button>
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
      <Dialog open={editModal} onOpenChange={setEditModal}>
        <DialogContent
          onInteractOutside={(e) => {
            if (file) {
              e.preventDefault();
              if (!isLoading) {
                setAlertOpen(true);
              }
            }
          }}
          className="w-[345px]"
        >
          <DialogHeader>
            <DialogTitle>Edit profile photo</DialogTitle>
          </DialogHeader>
          <Separator />
          <ImageUploadDialog
            currentUser={currentUser}
            setEditModal={setEditModal}
            isLoadingCallback={setIsLoading}
            alertOpen={alertOpen}
            file={file}
            setFile={setFile}
            type="avatar"
          />
        </DialogContent>
      </Dialog>
      <div className="mb-5">
        <h2 className="inline-flex items-center gap-3 text-4xl font-semibold">
          {currentUser.username}
        </h2>
        <h4 className="text-xs text-muted-foreground">{fullname}</h4>
        <h4 className="text-sm text-muted-foreground">
          {currentUser.StudentData.department}
        </h4>
      </div>
    </div>
  );
};

export default ProfileAvatar;
