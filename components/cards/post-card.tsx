"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import ProfileHover from "../shared/profile-hover";
import { format, formatDistanceToNow } from "date-fns";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  MoreHorizontal,
  Pencil,
  PlusCircle,
  Text,
  Trash,
  UserPlus,
  X,
} from "lucide-react";
import Loader from "../loaders/loader";
import Linkify from "linkify-react";
import { PostProps } from "@/types/post";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Session } from "next-auth";
import PostForm from "../forms/post-form";
import EditContentForm from "../forms/edit-content-form";
import { AnimatePresence, motion } from "framer-motion";
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
} from "../ui/alert-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteImage } from "@/lib/actions/image.actions";

interface PostCardProps {
  post: PostProps;
  session: Session | null;
}

const options = {
  target: "_blank",
  className: "text-blue-500 hover:underline",
};

const PostCard: React.FC<PostCardProps> = ({ post, session }) => {
  const [actionDropdown, setActionDropdown] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const [isDirty, setIsDirty] = useState<boolean>();
  const [isImageDirty, setIsImageDirty] = useState<boolean>();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const postedAt = new Date(post.createdAt);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter()
  const [alertOpen, setAlertOpen] = useState(false);
  const ShortContentWithNoImage =
    post.content.length < 40 && post.imageUrls?.length === 0;

  const contentToDisplay = showFullContent
    ? post.content
    : post.content.slice(0, 500);

  const toggleContentVisibility = () => {
    setShowFullContent(!showFullContent);
  };

  async function handleDeleteImage(
    e: React.MouseEvent<HTMLButtonElement>,
    id: number,
  ) {
    e.preventDefault();

    const response = await deleteImage(id);

    if (response.status === 200) {
      router.refresh()
    } else {
      toast.error("Uh oh! Something went wrong.", {
        description:
          "An error occurred while making the request. Please try again later",
      });
    }
  }

  return (
    <Card className="mb-4 min-h-[200px]">
      <CardHeader className="flex-row items-center justify-between">
        <div className="relative flex items-center space-x-2">
          <ProfileHover post={post} />
          <div className="flex flex-col">
            <Link
              href="/"
              className="flex items-center gap-1 font-semibold hover:underline"
            >
              {post.author.username}
              {/* {post.author.role === "SYSTEMADMIN" && (
                <BadgeCheck className="h-4 w-4 text-red-500" />
              )}
              {post.author.role === "ADMIN" && (
                <BadgeCheck className="h-4 w-4 text-primary" />
              )} */}
            </Link>
            <div className="flex items-center">
              <p className="text-xs font-light text-muted-foreground">
                {formatDistanceToNow(postedAt, { addSuffix: true })}
              </p>
            </div>
          </div>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DropdownMenu
            open={actionDropdown}
            onOpenChange={setActionDropdown}
            modal={false}
          >
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-[100px] p-1.5">
              {session?.user.id === post.author.id && (
                <>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="text-xs">
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent className="min-w-[100px] p-1.5">
                        <DropdownMenuItem
                          className="text-xs"
                          onClick={() => setIsEditing(true)}
                        >
                          <Text className="mr-2 h-4 w-4" />
                          Caption
                        </DropdownMenuItem>
                        <DialogTrigger disabled={isEditing} asChild>
                          <DropdownMenuItem
                            className="text-xs"
                            onSelect={(e) => e.preventDefault()}
                          >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            More
                          </DropdownMenuItem>
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
                            <AlertDialog
                              open={alertOpen}
                              onOpenChange={setAlertOpen}
                            >
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
                                    You have unsaved changes. Are you sure you
                                    want to leave?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    Continue editing
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => setOpen(false)}
                                  >
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
                            <DialogTitle>Edit post</DialogTitle>
                          </DialogHeader>
                          <PostForm
                            onMutationSuccess={setOpen}
                            hasUserInput={setIsDirty}
                            hasUserImages={setIsImageDirty}
                            onLoading={setIsLoading}
                            editData={post}
                          />
                        </DialogContent>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <Dialog>
                    <DialogTrigger asChild>
                      <DropdownMenuItem
                        className="text-xs text-red-600"
                        onSelect={(e) => e.preventDefault()}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">
                          Are you absolutely sure?
                        </DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently
                          delete the post from our servers.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Close</Button>
                        </DialogClose>
                        <Button
                          variant="destructive"
                          onClick={() => {}}
                          disabled={isLoading}
                        >
                          {isLoading && <Loader />}
                          Continue
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <AnimatePresence>
            {isEditing && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <EditContentForm
                  postId={post.postId}
                  content={post.content}
                  setIsEditing={setIsEditing}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence initial={false}>
            {isEditing === false && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <Linkify options={options}>
                  <p
                    className={cn(
                      ShortContentWithNoImage && "text-2xl",
                      "whitespace-pre-wrap break-words",
                    )}
                  >
                    {contentToDisplay}
                    {post.content.length > 500 && (
                      <Button
                        variant="link"
                        onClick={toggleContentVisibility}
                        className="-mt-5 ml-1 p-0 text-slate-200"
                      >
                        {showFullContent ? "See Less" : "...See More"}
                      </Button>
                    )}
                  </p>
                </Linkify>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <Link href={`/post/${post.postId}`}>
          <div className="relative mt-5 flex w-full overflow-hidden rounded-md">
            <div
              className={cn(
                post.imageUrls?.length === 1 ? "grid-cols-1" : "grid-cols-2",
                "grid w-full flex-1",
              )}
            >
              {post.imageUrls?.slice(0, 4).map((image, index) => (
                <div
                  key={image.id}
                  className={cn(
                    post.imageUrls?.length === 3 && index === 0 && "col-span-2",
                    post.imageUrls?.length === 1 ? "h-[400px]" : "h-[250px]",
                    "relative w-full",
                  )}
                >
                  {isEditing && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="group absolute right-0 top-0 z-10 rounded-full bg-background/50"
                      onClick={(e) => {
                        handleDeleteImage(e, image.id);
                      }}
                    >
                      <X className="h-5 w-5 group-active:scale-95" />
                    </Button>
                  )}
                  <div
                    className={cn(
                      index === 3 && post.imageUrls
                        ? post.imageUrls.length >= 5 && "bg-black/40"
                        : null,
                      "absolute flex h-full w-full items-center justify-center rounded-md duration-300 hover:bg-black/20",
                    )}
                  >
                    {index === 3 && post.imageUrls
                      ? post.imageUrls?.length >= 5 && <p>More...</p>
                      : null}
                  </div>
                  {image.url && (
                    <Image
                      className="h-full w-full object-cover object-center"
                      src={image.url}
                      alt="post image"
                      width={1000}
                      height={1000}
                      quality={100}
                      // placeholder="blur"
                      // blurDataURL=""
                      priority
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </Link>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default PostCard;
