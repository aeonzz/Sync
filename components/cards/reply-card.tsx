"use client";

import { Card } from "../ui/card";
import { ReplyProps } from "@/types/post";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import {
  checkIfUserLikedComment,
  likeComment,
} from "@/lib/actions/comment.actions";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import LikeButton from "../ui/like-button";
import CommentMenu from "../ui/comment-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ProfileHover from "../shared/profile-hover";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface ReplyCardProps {
  reply: ReplyProps;
  userId: string;
  postId: string;
  avatarUrl: string | null;
  username: string | null;
  postAuthor: string;
  className: string;
}

const ReplyCard: React.FC<ReplyCardProps> = ({
  reply,
  userId,
  postAuthor,
  postId,
  avatarUrl,
  username,
  className,
}) => {
  const replyCreatedAt = new Date(reply.createdAt);
  const replyCreated = formatDistanceToNow(replyCreatedAt, {
    addSuffix: true,
  });
  const [likedBy, setLikedBy] = useState(reply.commentLike);
  const [liked, setLiked] = useState<boolean>();
  const [open, setOpen] = useState(false);

  async function handleLike() {
    const data = {
      userId,
      commentId: reply.id,
    };

    const response = await likeComment(data);

    if (response.status === 200) {
      setLiked((prev) => !prev);
      setLikedBy(response.data ?? []);
    } else {
      toast.error("Uh oh! Something went wrong.", {
        description:
          "An error occurred while making the request. Please try again later",
      });
    }
  }

  useEffect(() => {
    const checkIfUserLiked = async () => {
      const response = await checkIfUserLikedComment(userId, reply.id);
      setLiked(response);
    };
    checkIfUserLiked();
  }, [liked, reply.id]);

  return (
    <div className={cn(className, "mb-3")}>
      <div className="flex space-x-2">
        <div className="flex flex-col items-center justify-start gap-1">
          <HoverCard openDelay={200} closeDelay={100}>
            <HoverCardTrigger asChild>
              <Link href={`/u/${reply.user.id}`} className="group relative">
                <div className="absolute z-10 rounded-full bg-card/30 opacity-0 transition group-hover:opacity-100" />
                <Avatar className="h-7 w-7">
                  <AvatarImage
                    src={reply.user.avatarUrl ?? undefined}
                    className="object-cover"
                    alt={reply.user.avatarUrl ?? undefined}
                  />
                  <AvatarFallback>
                    {reply.user.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </HoverCardTrigger>
            <HoverCardContent
              className="min-h-32 w-[250px]"
              hideWhenDetached={true}
            >
              <ProfileHover
                userId={reply.user.id}
                showFollowButton={true}
                currentUserId={userId}
              />
            </HoverCardContent>
          </HoverCard>
          <div className="h-full w-px bg-stone-800" />
        </div>
        <div className="w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Card className="flex w-fit flex-col space-y-1 p-2">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/u/${reply.user.id}`}
                    className="text-sm font-semibold hover:underline"
                  >
                    {reply.user.username}
                  </Link>
                  {postAuthor === reply.user.id && (
                    <Badge
                      variant="secondary"
                      className=" text-[10px] font-normal"
                    >
                      Author
                    </Badge>
                  )}
                  <Separator orientation="vertical" />
                  <p className="text-[10px] text-muted-foreground">
                    {replyCreated}
                  </p>
                </div>
                <p className="whitespace-pre-wrap break-words break-all text-sm font-light">
                  {reply.text}
                </p>
              </Card>
              {userId === reply.user.id && (
                <CommentMenu
                  commentId={reply.id}
                  avatarUrl={avatarUrl}
                  username={username}
                  userId={userId}
                  postId={postId}
                  text={reply.text}
                />
              )}
            </div>

            <div className="mr-2 space-y-1">
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="iconRound"
                      onClick={handleLike}
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
                  <TooltipContent side="left">
                    <p>Like</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p
                      className="cursor-pointer text-center text-xs hover:underline"
                      onClick={() => likedBy.length !== 0 && setOpen(true)}
                    >
                      {likedBy.length}
                    </p>
                  </TooltipTrigger>
                  {likedBy.length !== 0 && (
                    <TooltipContent side="left">
                      {likedBy.map((user, index) => (
                        <p key={index} className="text-xs">
                          {user.user.username}
                        </p>
                      ))}
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-sm">
                  <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-0 active:scale-95 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                  </DialogClose>
                  <DialogHeader>
                    <DialogTitle>Engagers</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="max-h-[316px]">
                    {likedBy.map((user, index) => (
                      <div
                        key={index}
                        className="flex w-full items-center justify-between rounded-md p-2 hover:bg-card"
                      >
                        <div className="flex items-center space-x-2">
                          <HoverCard openDelay={200} closeDelay={100}>
                            <HoverCardTrigger asChild>
                              <Link
                                href={`/u/${reply.user.id}`}
                                className="group relative"
                              >
                                <div className="absolute z-10 rounded-full bg-card/30 opacity-0 transition group-hover:opacity-100" />
                                <Avatar>
                                  <AvatarImage
                                    src={reply.user.avatarUrl ?? undefined}
                                    className="object-cover"
                                    alt={reply.user.avatarUrl ?? undefined}
                                  />
                                  <AvatarFallback>
                                    {reply.user.username
                                      ?.charAt(0)
                                      .toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                              </Link>
                            </HoverCardTrigger>
                            <HoverCardContent
                              className="min-h-32 w-[250px]"
                              hideWhenDetached={true}
                            >
                              <ProfileHover
                                userId={reply.user.id}
                                showFollowButton={true}
                                currentUserId={userId}
                              />
                            </HoverCardContent>
                          </HoverCard>
                          <Link
                            href={`/p/${user.user.id}`}
                            className="flex items-center gap-1 text-sm hover:underline"
                          >
                            {user.user.username}
                          </Link>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReplyCard;
