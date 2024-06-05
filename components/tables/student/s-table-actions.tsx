"use client";

import { StudentData } from "@prisma/client";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import StudentForm from "@/components/forms/student-form";

interface STableActionsProps {
  row: StudentData;
}

const STableActions: React.FC<STableActionsProps> = ({ row }) => {
  const [actionDropdown, setActionDropdown] = useState(false);
  const [open, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // async function handleDelete() {
  //   setIsLoading(true);
  // }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenu
        open={actionDropdown}
        onOpenChange={setActionDropdown}
        modal={false}
      >
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[100px] p-1.5">
          <DialogTrigger asChild>
            <DropdownMenuItem disabled={isEditing} className="w-full">
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Update user
          </DialogTitle>
          <DialogDescription>
            Please provide the following information to update user to the
            system.
          </DialogDescription>
        </DialogHeader>
        <StudentForm setOpen={setOpen} formData={row} />
      </DialogContent>

      {/* <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
<AlertDialogTrigger asChild>
  <DropdownMenuItem
    className="text-red-600"
    onSelect={(e) => e.preventDefault()}
  >
    <Trash className="mr-2 h-4 w-4" />
    Delete
  </DropdownMenuItem>
</AlertDialogTrigger>
<AlertDialogContent>
  <AlertDialogHeader>
    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
    <AlertDialogDescription>
      This action cannot be undone. This will permanently delete the
      post from our servers.
    </AlertDialogDescription>
  </AlertDialogHeader>
  <AlertDialogFooter>
    <AlertDialogCancel>Cancel</AlertDialogCancel>
    <AlertDialogAction onClick={() => handleDelete()}>
      Continue
    </AlertDialogAction>
  </AlertDialogFooter>
</AlertDialogContent>
</AlertDialog> */}
    </Dialog>
  );
};

export default STableActions;
