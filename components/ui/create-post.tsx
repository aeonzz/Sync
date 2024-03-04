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
import { Separator } from "./separator";
import PostForm from "../forms/post-form";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import Link from "next/link";
import { useState } from "react";
import { Session } from "next-auth";
import { CurrentUser } from "@/types/user";

interface CreatePostProps {
  currentUser: CurrentUser | null;
}

const CreatePost: React.FC<CreatePostProps> = ({ currentUser }) => {
  const [open, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const displayName = currentUser?.displayName;
  const initialLetter = displayName?.charAt(0).toUpperCase();
  const [isDirty, setIsDirty] = useState<boolean>();
  const [isImageDirty, setIsImageDirty] = useState<boolean>();

  return (
    <Card className="w-[450px]">
      <div className="flex items-center px-5 pb-2 pt-1">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="flex w-full items-center space-x-3">
            <Input
              placeholder="Write your thoughts here..."
              className="rounded-none border-none bg-transparent pl-0 transition focus-visible:ring-0 focus-visible:ring-black"
            />
            <PlusCircle className="h-8 w-8 transition-transform active:scale-95" />
          </DialogTrigger>
          <DialogContent
            onInteractOutside={(e) => {
              if (isDirty || isImageDirty) {
                e.preventDefault();
                setAlertOpen(true);
              }
            }}
          >
            {isDirty || isImageDirty ? (
              <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                <AlertDialogTrigger asChild>
                  <div className="absolute right-4 top-4 cursor-pointer rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-0 active:scale-95 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                    <X className="h-4 w-4" />
                  </div>
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
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogClose>
            )}
            <DialogHeader>
              <DialogTitle>Create post</DialogTitle>
            </DialogHeader>
            <Separator />
            <div className="flex items-center space-x-2">
              <Avatar className="group relative h-9 w-9 dark:border">
                <Link href="/user/profile" className="relative">
                  <div className="absolute z-10 h-9 w-9 bg-stone-950 opacity-0 transition group-hover:opacity-40"></div>
                  <AvatarImage
                    src={
                      currentUser?.avatarUrl ? currentUser.avatarUrl : undefined
                    }
                    alt={
                      currentUser?.displayName
                        ? currentUser.displayName
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
                  {displayName}
                </h4>
                <h4 className="scroll-m-20 text-xs text-muted-foreground">
                  {currentUser?.StudentData.name}
                </h4>
              </div>
            </div>
            <PostForm
              onMutationSuccess={setOpen}
              hasUserInput={setIsDirty}
              hasUserImages={setIsImageDirty}
            />
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
};

export default CreatePost;
