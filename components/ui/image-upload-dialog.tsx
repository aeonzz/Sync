"use client";

import {
  Dialog,
  DialogClose,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import Loader from "../loaders/loader";
import { SingleImageDropzone } from "../forms/single-image";
import { Separator } from "./separator";
import { Button } from "./button";
import { X } from "lucide-react";
import { useState } from "react";
import { useEdgeStore } from "@/lib/edgestore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CurrentUser } from "@/types/user";
import { updateUser } from "@/lib/actions/user.actions";

interface ImageUploadDialogProps {
  currentUser: CurrentUser;
  setEditModal: (state: boolean) => void;
  isLoadingCallback: (state: boolean) => void;
  alertOpen: boolean;
  file: File | undefined;
  setFile: (file: File | undefined) => void;
  type: string;
}

const ImageUploadDialog: React.FC<ImageUploadDialogProps> = ({
  currentUser,
  setEditModal,
  isLoadingCallback,
  alertOpen,
  file,
  setFile,
  type,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { edgestore } = useEdgeStore();
  const router = useRouter();

  const onSubmit = async () => {
    setIsLoading(true);
    isLoadingCallback(true);
    let res;
    if (file) {
      try {
        res = await edgestore.publicImages.upload({
          file,
        });
      } catch (error) {
        setIsLoading(false);
        isLoadingCallback(false);
        toast.error("Uh oh! Something went wrong.", {
          description: "Could not upload photo, Try again later.",
        });
      }
    }

    const userData = {
      userId: currentUser.id,
      avatarUrl: res?.url,
    }
    // let userData;
    // if (type === "profile") {
    //   userData = {
    //     userId: currentUser.id,
    //     avatarUrl: res?.url,
    //   };
    // } else {
    //   userData = {
    //     userId: currentUser.id,
    //     coverUrl: res?.url,
    //   };
    // }

    const result = await updateUser(userData);

    if (result.status === 200) {
      setEditModal(false);
      router.refresh();
      setIsLoading(false);
      isLoadingCallback(false);
      setFile(undefined);
    } else {
      setIsLoading(false);
      isLoadingCallback(false);
      toast.error("Uh oh! Something went wrong.", {
        description:
          "An error occurred while making the request. Please try again later",
      });
    }
  };

  return (
    <>
      {file ? (
        <AlertDialog open={alertOpen}>
          <AlertDialogTrigger asChild>
            <button
              className="absolute right-4 top-4 cursor-pointer rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-0 active:scale-95 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                You have unsaved changes. Are you sure you want to leave?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Continue editing</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setEditModal(false), setFile(undefined);
                }}
              >
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
      <div className="mt-5 flex w-full items-center justify-center">
        <SingleImageDropzone
          width={160}
          height={160}
          disabled={isLoading}
          value={file}
          onChange={(file) => {
            setFile(file);
          }}
        />
      </div>
      <Button
        className="mt-5 w-full"
        type="submit"
        disabled={isLoading || !file}
        onClick={onSubmit}
      >
        {isLoading && <Loader />}
        {isLoading ? null : <p>Confirm</p>}
      </Button>
    </>
  );
};

export default ImageUploadDialog;
