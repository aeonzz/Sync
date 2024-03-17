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
import { Separator } from "./separator";

interface ProfileCoverProps {
  currentUser: CurrentUser;
}

const ProfileCover: React.FC<ProfileCoverProps> = ({ currentUser }) => {
  const [editModal, setEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [file, setFile] = useState<File | undefined>(undefined);

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Image
            fill
            className="cursor-pointer rounded-lg object-cover object-center"
            src={loginImage}
            alt="profile-picture"
          />
        </DialogTrigger>
        <DialogImage>
          <Image
            className="object-cover"
            src={loginImage}
            alt="Cover Photo"
            width={1000}
            height={1000}
            quality={100}
          />
        </DialogImage>
      </Dialog>
      <Dialog open={editModal} onOpenChange={setEditModal}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant="secondary"
            className="absolute bottom-2 right-2 px-10 text-xs"
          >
            Edit Cover
          </Button>
        </DialogTrigger>
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
            <DialogTitle>Edit cover photo</DialogTitle>
          </DialogHeader>
          <Separator />
          <ImageUploadDialog
            currentUser={currentUser}
            setEditModal={setEditModal}
            isLoadingCallback={setIsLoading}
            alertOpen={alertOpen}
            file={file}
            setFile={setFile}
            type="cover"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfileCover;
