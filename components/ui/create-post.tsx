"use client";

import React, { useState } from "react";
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

const CreatePost = () => {
  const [open, setOpen] = useState(false);

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
          <DialogContent onInteractOutside={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle>Create post</DialogTitle>
            </DialogHeader>
            <Separator />
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
};

export default CreatePost;
