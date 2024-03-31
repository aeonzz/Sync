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
  CircleUserRound,
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
import { deletePost } from "@/lib/actions/post.actions";
import { toast } from "sonner";
import { useMutationSuccess } from "@/context/store";
import CommentForm from "../forms/comment-form";

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
  const [open, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const postedAt = new Date(post.createdAt);
  const [isEditing, setIsEditing] = useState(false);
  const { setIsMutate } = useMutationSuccess();
  const ShortContentWithNoImage =
    post.content.length < 40 && post.imageUrls?.length === 0;

  const contentToDisplay = showFullContent
    ? post.content
    : post.content.slice(0, 100);

  const toggleContentVisibility = () => {
    setShowFullContent(!showFullContent);
  };

  async function handleDelete() {
    const response = await deletePost(post.postId);

    if (response.status === 200) {
      setIsMutate(true);
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
          <ProfileHover
            authorId={post.author.id}
            avatarUrl={post.author.avatarUrl}
            coverUrl={post.author.coverUrl}
            userJoined={post.author.createdAt}
            username={post.author.username}
            firstName={post.author.StudentData.firstName}
            middleName={post.author.StudentData.middleName}
            lastName={post.author.StudentData.lastName}
            department={post.author.StudentData.department}
          />
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
                  <DropdownMenuItem
                    className="text-xs"
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>

                  <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        className="text-xs text-red-600"
                        onSelect={(e) => e.preventDefault()}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the post from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete()}>
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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
                className="border border-transparent"
              >
                <EditContentForm
                  postId={post.postId}
                  content={post.content}
                  setIsEditing={setIsEditing}
                  editData={post}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <Link href={`/post/${post.postId}`}>
          <div className="relative mb-3 flex w-full overflow-hidden rounded-md">
            <div
              className={cn(
                post.imageUrls?.length === 1 ? "grid-cols-1" : "grid-cols-2",
                "grid w-full flex-1 gap-[1px]",
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
                      width={700}
                      height={700}
                      quality={50}
                      placeholder="blur"
                      blurDataURL={image.blurDataUrl}
                      priority
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </Link>
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
                    ShortContentWithNoImage ? "text-2xl" : "text-sm",
                    "whitespace-pre-wrap break-words",
                  )}
                >
                  {contentToDisplay}
                  {post.content.length > 100 && (
                    <Button
                      variant="link"
                      onClick={toggleContentVisibility}
                      className="-mt-5 ml-1 p-0 text-xs text-slate-200"
                    >
                      {showFullContent ? "See Less" : "...See More"}
                    </Button>
                  )}
                </p>
              </Linkify>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
      <CardFooter className="flex-col space-y-5">
        <div className="flex w-full justify-between">
          <div className="-mr-5 flex">
            <CircleUserRound />
            <CircleUserRound />
            <CircleUserRound />
            <CircleUserRound />
          </div>
          <div className="flex space-x-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
              />
            </svg>
          </div>
        </div>
        <CommentForm post={post} session={session} />
      </CardFooter>
    </Card>
  );
};

export default PostCard;
