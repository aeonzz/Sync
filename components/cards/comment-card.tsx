"use client";

import { Card } from "../ui/card";
import { CommentProps, PostProps } from "@/types/post";
import ProfileHover from "../shared/profile-hover";
import Link from "next/link";
import { formatDistanceToNow, formatDistanceToNowStrict } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import ReplyCard from "./reply-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CommentForm from "../forms/comment-form";
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
import { Button } from "../ui/button";
import {
  checkIfUserLikedComment,
  likeComment,
} from "@/lib/actions/comment.actions";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { X } from "lucide-react";

interface CommentCardProps {
  comment: CommentProps;
  userId: string;
  postId: string;
  postAuthor: string;
  className: string;
  avatarUrl: string | null;
  username: string | null;
}

const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  userId,
  postId,
  postAuthor,
  className,
  avatarUrl,
  username,
}) => {

  const commentCreatedAt = new Date(comment.createdAt);
  const commentCreated = formatDistanceToNow(commentCreatedAt, {
    addSuffix: true,
  });
  const [likedBy, setLikedBy] = useState(comment.commentLike)
  const [liked, setLiked] = useState<boolean>();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsloading] = useState(false)

  async function handleLike() {
    setIsloading(true)
    const data = {
      userId,
      commentId: comment.id,
    };

    const response = await likeComment(data);
    
    if (response.status === 200) {
      setIsloading(false)
      setLiked((prev) => !prev);
      setLikedBy(response.data ?? [])
    } else {
      setIsloading(false)
      toast.error("Uh oh! Something went wrong.", {
        description:
          "An error occurred while making the request. Please try again later",
      });
    }
  }

  useEffect(() => {
    const checkIfUserLiked = async () => {
      const response = await checkIfUserLikedComment(userId, comment.id);
      setLiked(response);
    };
    checkIfUserLiked();
  }, [liked, comment.id]);

  return (
    <div className={cn(className, "mb-3")}>
      <div className="flex space-x-2">
        <div className="flex flex-col items-center justify-start gap-1">
          <ProfileHover
            authorId={comment.user.id}
            avatarUrl={comment.user.avatarUrl}
            coverUrl={comment.user.coverUrl}
            userJoined={comment.user.createdAt}
            username={comment.user.username}
            firstName={comment.user.studentData.firstName}
            middleName={comment.user.studentData.middleName}
            lastName={comment.user.studentData.lastName}
            department={comment.user.studentData.department}
            className="h-7 w-7"
          />
          <div className="h-[calc(100%-45px)] w-px bg-stone-800" />
        </div>
        <div className="w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Card className="flex w-fit flex-col space-y-1 p-2">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/u/${comment.user.id}`}
                    className="text-sm font-semibold hover:underline"
                  >
                    {comment.user.username}
                  </Link>
                  {postAuthor === comment.user.id && (
                    <Badge
                      variant="secondary"
                      className=" text-[10px] font-normal"
                    >
                      Author
                    </Badge>
                  )}
                  <p className="text-[10px] text-muted-foreground">
                    {commentCreated}
                  </p>
                </div>
                <p className="whitespace-pre-wrap break-words break-all text-sm font-light">
                  {comment.text}
                </p>
              </Card>
              {userId === comment.user.id && (
                <CommentMenu
                  commentId={comment.id}
                  avatarUrl={avatarUrl}
                  username={username}
                  userId={userId}
                  postId={postId}
                  text={comment.text}
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
                          <ProfileHover
                            authorId={user.user.id}
                            avatarUrl={user.user.avatarUrl}
                            coverUrl={user.user.coverUrl}
                            userJoined={user.user.createdAt}
                            username={user.user.username}
                            firstName={user.user.studentData.firstName}
                            middleName={user.user.studentData.middleName}
                            lastName={user.user.studentData.lastName}
                            department={user.user.studentData.department}
                            side="left"
                            align="start"
                            sideOffset={20}
                          />
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
            {/* <LikeButton
              userId={userId}
              commentId={comment.id}
              likeCount={comment._count.commentLike}
              likedBy={comment.commentLike}
            /> */}
          </div>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1" className="border-transparent">
              <AccordionTrigger disabled={isLoading} className="mt-1 !flex-none justify-start gap-1 py-0 pl-3 text-xs text-muted-foreground">
                {comment.replies.length > 0 ? (
                  <p>View {comment._count.replies} replies</p>
                ) : (
                  "Reply"
                )}
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                {comment.replies.map((reply, index) => (
                  <ReplyCard
                    key={index}
                    reply={reply}
                    userId={userId}
                    avatarUrl={avatarUrl}
                    username={username}
                    postId={postId}
                    postAuthor={postAuthor}
                    className={cn(index === 0 && "mt-3")}
                  />
                ))}
                <CommentForm
                  avatarUrl={avatarUrl}
                  username={username}
                  userId={userId}
                  postId={postId}
                  parentId={comment.id}
                  className="mt-2 pr-4"
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
