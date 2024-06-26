"use client";

import {
  checkIfUserLikedComment,
  likeComment,
} from "@/lib/actions/comment.actions";
import { Button } from "./button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
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
import Link from "next/link";
import { X } from "lucide-react";
import { ScrollArea } from "./scroll-area";
import { useMutationSuccess } from "@/context/store";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import ProfileHover from "../shared/profile-hover";

interface LikeButtonProps {
  userId: string;
  commentId: string;
  likeCount: number;
  likedBy: {
    id: number;
    user: {
      id: string;
      studentId: number;
      username: string | null;
      avatarUrl: string | null;
      coverUrl: string;
      createdAt: Date;
      studentData: {
        firstName: string;
        middleName: string;
        lastName: string;
        department: string;
      };
    };
  }[];
}

const LikeButton: React.FC<LikeButtonProps> = ({
  userId,
  commentId,
  likeCount,
  likedBy,
}) => {
  const [likers, setLikers] = useState(likedBy);
  const [liked, setLiked] = useState<boolean>();
  const [open, setOpen] = useState(false);
  const { setIsMutate } = useMutationSuccess();
  const router = useRouter();

  async function handleLike() {
    const data = {
      userId,
      commentId,
    };

    const response = await likeComment(data);

    if (response.status === 200) {
      setLiked((prev) => !prev);
      router.refresh();
    } else {
      toast.error("Uh oh! Something went wrong.", {
        description:
          "An error occurred while making the request. Please try again later",
      });
    }
  }

  useEffect(() => {
    const checkIfUserLiked = async () => {
      const response = await checkIfUserLikedComment(userId, commentId);
      setLiked(response);
    };
    checkIfUserLiked();
  }, [liked, commentId, userId]);

  return (
    <div className="mr-2 space-y-1">
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="iconRound" onClick={handleLike}>
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
              {likeCount}
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
                  <HoverCard openDelay={200} closeDelay={100} key={index}>
                    <HoverCardTrigger asChild>
                      <Link
                        href={`/u/${user.user.id}`}
                        className="group relative"
                      >
                        <div className="absolute z-10 rounded-full bg-card/30 opacity-0 transition group-hover:opacity-100" />
                        <Avatar
                          className={cn(index !== 0 && "-ml-2", "h-6 w-6")}
                        >
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
  );
};

export default LikeButton;
