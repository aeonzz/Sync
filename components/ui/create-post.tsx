"use client";

import { Card } from "./card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Input } from "./input";
import { PlusCircle } from "lucide-react";
import { Separator } from "./separator";
import PostForm from "../forms/post-form";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import Link from "next/link";
import { Session } from "next-auth";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CreatePostProps {
  session: Session | null;
}

const CreatePost: React.FC<CreatePostProps> = ({ session }) => {
  const [open, setOpen] = useState(false);
  const username = session?.user.username;
  const initialLetter = username?.charAt(0).toUpperCase();

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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create post</DialogTitle>
            </DialogHeader>
            <Separator />
            <div className="flex items-center space-x-2">
              <Avatar className="group relative h-9 w-9 dark:border">
                <Link href="/user/profile" className="relative">
                  <div className="absolute z-10 h-9 w-9 bg-stone-950 opacity-0 transition group-hover:opacity-40"></div>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    className="object-cover"
                  />
                  <AvatarFallback className="h-9 w-9 bg-stone-900 pb-1 pr-1">
                    {initialLetter}
                  </AvatarFallback>
                </Link>
              </Avatar>
              <h4 className="scroll-m-20 text-sm tracking-tight">{username}</h4>
            </div>
            <PostForm
              onMutationSuccess={setOpen}
            />
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
};

export default CreatePost;
