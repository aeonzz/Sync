"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Button } from "./button";
import EditProfileForm from "../forms/edit-profile-form";
import { CurrentUser } from "@/types/user";

interface EditProfileProps {
  currentUser: CurrentUser;
}

const EditProfile: React.FC<EditProfileProps> = ({ currentUser }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="absolute -bottom-12 right-0 px-10">
          Edit profile
        </Button>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => {
          if (isLoading) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>
        <EditProfileForm
          currentUser={currentUser}
          setOpen={setOpen}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditProfile;
