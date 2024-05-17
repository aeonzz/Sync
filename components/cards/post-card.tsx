"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "../ui/button";
import {
  MoreHorizontal,
  Pencil,
  Trash,
  X,
} from "lucide-react";
import Linkify from "linkify-react";
import { PostProps } from "@/types/post";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Session } from "next-auth";
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  checkIfUserLikedPost,
  deletePost,
  likePost,
} from "@/lib/actions/post.actions";
import { toast } from "sonner";
import { useMutationSuccess } from "@/context/store";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "../ui/scroll-area";
import Reactors from "../ui/reactors";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import ProfileHover from "../shared/profile-hover";
import ImageView from "../ui/image-view";
import { useQueryClient } from "@tanstack/react-query";
import { NotificationType } from "@prisma/client";
import { createNotification } from "@/lib/actions/notification.actions";

interface PostCardProps {
  post: PostProps;
  session: Session;
  detailsView?: boolean | undefined;
}

const options = {
  target: "_blank",
  className: "text-blue-500 hover:underline",
};

const PostCard: React.FC<PostCardProps> = ({ post, session, detailsView }) => {
  const [actionDropdown, setActionDropdown] = useState(false);
  const [openImageViewer, setOpenImageViewer] = useState(false);
  const [likedBy, setLikedBy] = useState(post.postLike);
  const [open, setOpen] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const postedAt = new Date(post.createdAt);
  const [isEditing, setIsEditing] = useState(false);
  const { setIsMutate } = useMutationSuccess();
  const [liked, setLiked] = useState(post.isLikedByCurrentUser);
  const router = useRouter();
  const queryClient = useQueryClient();

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
      router.refresh();
    } else {
      toast.error("Uh oh! Something went wrong.", {
        description:
          "An error occurred while making the request. Please try again later",
      });
    }
  }

  async function handleLike(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    e.stopPropagation();

    const data = {
      userId: session!.user.id,
      postId: post.postId,
    };

    const response = await likePost(data);

    if (response.status === 200) {
      setLiked((prev) => !prev);
      setLikedBy(response.data ?? []);

      if (session.user.id !== post.author.id) {
        if (!liked) {
          const notificationData = {
            type: NotificationType.LIKE,
            from: session.user.id,
            resourceId: `/f/${post.postId}`,
            text: post.content,
            recipientId: post.author.id,
          };

          await createNotification(notificationData);
        }
      }
    } else {
      toast.error("Uh oh! Something went wrong.", {
        description:
          "An error occurred while making the request. Please try again later",
      });
    }
  }

  // useEffect(() => {
  //   const checkIfUserLiked = async () => {
  //     const response = await checkIfUserLikedPost(
  //       session!.user.id,
  //       post.postId,
  //     );
  //     setLiked(response);
  //   };
  //   checkIfUserLiked();
  // }, [post, session]);

  return (
    <Card className="mb-4 min-h-[200px]">
      <CardHeader className="flex-row items-center justify-between">
        <div className="relative flex items-center space-x-2">
          <HoverCard openDelay={200} closeDelay={100}>
            <HoverCardTrigger asChild>
              <Link href={`/u/${post.author.id}`} className="group relative">
                <div className="absolute z-10 rounded-full bg-card/30 opacity-0 transition group-hover:opacity-100" />
                <Avatar>
                  <AvatarImage
                    src={post.author.avatarUrl ?? undefined}
                    className="object-cover"
                    alt={post.author.avatarUrl ?? undefined}
                  />
                  <AvatarFallback>
                    {post.author.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </HoverCardTrigger>
            <HoverCardContent
              className="min-h-32 w-[250px]"
              hideWhenDetached={true}
            >
              <ProfileHover
                userId={post.author.id}
                showFollowButton={true}
                currentUserId={session.user.id}
              />
            </HoverCardContent>
          </HoverCard>
          <div className="flex flex-col">
            <Link
              href={`/u/${post.author.id}`}
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
                  disabled={isEditing}
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
      </CardHeader>
      <CardContent className="pb-0">
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
        <ImageView
          openImageViewer={openImageViewer}
          setOpenImageViewer={setOpenImageViewer}
          imageUrls={post.imageUrls}
        />
        <Link href={`/f/${post.postId}`}>
          <div className="relative flex w-full overflow-hidden rounded-md">
            <div
              className={cn(
                post.imageUrls?.length === 1 ? "grid-cols-1" : "grid-cols-2",
                "grid w-full flex-1 gap-[1px]",
              )}
            >
              {post.imageUrls?.slice(0, 4).map((image, index) => (
                <div
                  key={image.id}
                  onClick={() => {
                    detailsView && setOpenImageViewer(true);
                  }}
                  className={cn(
                    post.imageUrls?.length === 3 && index === 0 && "col-span-2",
                    post.imageUrls?.length === 1 ? "h-[420px]" : "h-[220px]",
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
                      ? post.imageUrls?.length >= 5 && (
                          <p>+ {post._count.imageUrls - 4}</p>
                        )
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
              className={cn(
                post.imageUrls.length !== 0 && "mt-3",
                "overflow-hidden",
              )}
            >
              <Linkify options={options}>
                <p
                  className={cn(
                    ShortContentWithNoImage ? "text-2xl" : "text-sm",
                    "whitespace-pre-wrap break-words",
                  )}
                >
                  {post.imageUrls.length > 0 ? contentToDisplay : post.content}
                  {post.imageUrls.length > 0 && post.content.length > 100 && (
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
      <CardFooter>
        <div className="flex w-full items-center justify-between">
          <div className="-mr-5 flex items-center">
            {likedBy.slice(0, 5).map((user, index) => (
              <HoverCard openDelay={200} closeDelay={100} key={index}>
                <HoverCardTrigger asChild>
                  <Link href={`/u/${user.user.id}`} className="group relative">
                    <div className="absolute z-10 rounded-full bg-card/30 opacity-0 transition group-hover:opacity-100" />
                    <Avatar className={cn(index !== 0 && "-ml-2", "h-6 w-6")}>
                      <AvatarImage
                        src={user.user.avatarUrl ?? undefined}
                        className="object-cover"
                        alt={user.user.avatarUrl ?? undefined}
                      />
                      <AvatarFallback>
                        {user.user.username?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                </HoverCardTrigger>
                <HoverCardContent
                  className="min-h-32 w-[250px]"
                  hideWhenDetached={true}
                >
                  <ProfileHover
                    userId={user.user.id}
                    showFollowButton={true}
                    currentUserId={session.user.id}
                  />
                </HoverCardContent>
              </HoverCard>
            ))}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p
                    className="ml-1 h-auto cursor-pointer p-0 text-[11px] text-muted-foreground hover:underline"
                    onClick={() => likedBy.length !== 0 && setOpen(true)}
                  >
                    {likedBy.length > 1
                      ? `Liked by ${likedBy[1].user.username} and ${likedBy.length - 1} others`
                      : likedBy[0]
                        ? `Liked by ${likedBy[0].user.username}`
                        : null}
                  </p>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {likedBy.length > 0 &&
                    likedBy.map((user, index) => (
                      <p key={index} className="text-xs">
                        {user.user.username}
                      </p>
                    ))}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent className="max-w-sm">
                <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-0 active:scale-95 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </DialogClose>
                <DialogHeader>
                  <DialogTitle className="text-muted-foreground">
                    Reactors
                  </DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[316px]">
                  <Reactors
                    postId={post.postId}
                    currentUserId={session.user.id}
                  />
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <div className="flex">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="iconRound"
                      onClick={(e) => handleLike(e)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className={cn(
                          liked && "fill-red-500 stroke-red-500",
                          "h-6 w-6",
                        )}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                        />
                      </svg>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Like</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={`/f/${post.postId}`}
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "iconRound" }),
                      )}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                        />
                      </svg>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Comment</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="aspect-square rounded-full p-0 hover:bg-transparent"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                        />
                      </svg>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Share</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Link
              href={`/f/${post.postId}`}
              className={cn(
                buttonVariants({ variant: "link" }),
                "h-auto p-0 text-[11px] text-muted-foreground",
              )}
            >
              View all {post._count.comment} comments
            </Link>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
