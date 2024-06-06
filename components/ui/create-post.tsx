"use client";

import { Card } from "./card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "./input";
import { PlusCircle, X } from "lucide-react";
import PostForm from "../forms/post-form";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import Link from "next/link";
import { useState } from "react";
import { UserProps } from "@/types/user";
import { Switch } from "./switch";
import { Label } from "./label";
import { cn } from "@/lib/utils";
import { UserRoleType } from "@prisma/client";

interface CreatePostProps {
  currentUser: UserProps;
  announcement: boolean;
}

const CreatePost: React.FC<CreatePostProps> = ({
  currentUser,
  announcement,
}) => {
  const [checked, setChecked] = useState<boolean>(announcement);
  const [accChecked, setAccChecked] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const username = currentUser.username;
  const initialLetter = username?.charAt(0).toUpperCase();
  const [isDirty, setIsDirty] = useState<boolean>();
  const [isImageDirty, setIsImageDirty] = useState<boolean>();
  const fullname = `${currentUser.studentData.firstName} ${currentUser.studentData.middleName.charAt(0).toUpperCase()} ${currentUser.studentData.lastName}`;

  return (
    <Card className={cn(announcement ? "mb-0" : "mb-3", "w-full")}>
      <div className="flex items-center px-5 pb-2 pt-1">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="group mt-1 flex w-full items-center justify-center space-x-3">
            <Avatar className="group/avatar relative h-9 w-9">
              <Link href={`/u/${currentUser.id}`} className="relative">
                <div className="absolute z-10 h-9 w-9 bg-stone-950 opacity-0 transition group-hover/avatar:opacity-40"></div>
                <AvatarImage
                  src={
                    currentUser.avatarUrl ? currentUser.avatarUrl : undefined
                  }
                  alt={
                    currentUser.username ? currentUser.username : "No avatar"
                  }
                  className="object-cover"
                />
                <AvatarFallback className="h-9 w-9 bg-stone-900 pb-1 pr-1">
                  {initialLetter}
                </AvatarFallback>
              </Link>
            </Avatar>
            <Input
              placeholder={
                announcement ? "Post an announcement" : "What's on your mind?"
              }
              className="rounded-none border-none bg-transparent pl-0 transition focus-visible:ring-0 focus-visible:ring-black"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-8 w-8 cursor-pointer fill-none stroke-foreground outline-none transition-transform duration-500 active:scale-95 group-hover:rotate-90 group-active:stroke-blue-200 group-active:duration-0"
            >
              <path
                d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                strokeWidth="1.8"
              ></path>
              <path d="M8 12H16" strokeWidth="1.5"></path>
              <path d="M12 16V8" strokeWidth="1.5"></path>
            </svg>
          </DialogTrigger>
          <DialogContent
            onInteractOutside={(e) => {
              if (isDirty || isImageDirty) {
                e.preventDefault();
                if (!isLoading) {
                  setAlertOpen(true);
                }
              }
            }}
          >
            {isDirty || isImageDirty ? (
              <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                <AlertDialogTrigger asChild>
                  <button
                    className="absolute right-4 top-4 cursor-pointer rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-0 active:scale-95 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                    disabled={isLoading}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      You have unsaved changes. Are you sure you want to leave?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Continue editing</AlertDialogCancel>
                    <AlertDialogAction onClick={() => setOpen(false)}>
                      Close
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-0 active:scale-95 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </DialogClose>
            )}
            <DialogHeader>
              <DialogTitle>Create post</DialogTitle>
            </DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Avatar className="group relative h-9 w-9 dark:border">
                  <Link href={`/u/${currentUser.id}`} className="relative">
                    <div className="absolute z-10 h-9 w-9 bg-stone-950 opacity-0 transition group-hover:opacity-40"></div>
                    <AvatarImage
                      src={
                        currentUser.avatarUrl
                          ? currentUser.avatarUrl
                          : undefined
                      }
                      alt={
                        currentUser.username
                          ? currentUser.username
                          : "No avatar"
                      }
                      className="object-cover"
                    />
                    <AvatarFallback className="h-9 w-9 bg-stone-900 pb-1 pr-1">
                      {initialLetter}
                    </AvatarFallback>
                  </Link>
                </Avatar>
                <div className="space-y-1">
                  <h4 className="text-md scroll-m-20 font-medium leading-none tracking-tight">
                    {username}
                  </h4>
                  <h4 className="scroll-m-20 text-xs text-muted-foreground">
                    {fullname}
                  </h4>
                </div>
              </div>
              <div className="space-y-1">
                {currentUser.role !== UserRoleType.USER && (
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="announcement" className="text-xs">
                      Announcement
                    </Label>
                    <Switch
                      id="announcement"
                      checked={checked}
                      onCheckedChange={setChecked}
                    />
                  </div>
                )}
                {checked && (
                  <div className="flex items-center justify-end space-x-2">
                    <Label htmlFor="announcement" className="text-xs">
                      {accChecked ? "Exclusive" : "Public"}
                    </Label>
                    <Switch
                      id="accessibility"
                      checked={accChecked}
                      onCheckedChange={setAccChecked}
                    />
                  </div>
                )}
              </div>
            </div>
            <PostForm
              onMutationSuccess={setOpen}
              hasUserInput={setIsDirty}
              hasUserImages={setIsImageDirty}
              onLoading={setIsLoading}
              currentUser={currentUser}
              checked={checked}
              accChecked={accChecked}
            />
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
};

export default CreatePost;
