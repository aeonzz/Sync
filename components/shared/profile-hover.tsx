import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { BadgeCheck, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { PostProps } from "@/types/post";
import { format } from "date-fns";

interface ProfileHoverProps {
  post: PostProps;
  className?: string;
}

const ProfileHover: React.FC<ProfileHoverProps> = ({ post, className }) => {
  const profile = post.author.avatarUrl ? post.author.avatarUrl : undefined;
  const authorCreatedAt = new Date(post.author.createdAt);
  const date = format(authorCreatedAt, "PP");
  const initialLetter = post.author.username.charAt(0).toUpperCase();

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Link href={`/user/${post.author.id}`} className="group relative">
          <div className="absolute z-50 h-9 w-9 rounded-full bg-card/30 opacity-0 transition group-hover:opacity-100" />
          <Avatar>
            <AvatarImage src={profile} className="object-cover" />
            <AvatarFallback>{initialLetter}</AvatarFallback>
          </Avatar>
        </Link>
      </HoverCardTrigger>
      <HoverCardContent
        className="w-[250px]"
        hideWhenDetached={true}
        sideOffset={10}
        align="start"
      >
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage src={profile} alt={post.author.displayName} />
            <AvatarFallback>{initialLetter}</AvatarFallback>
          </Avatar>
          <div className="w-full space-y-1">
            <Link
              href={`/user/${post.author.id}`}
              className="flex items-center gap-1 text-sm font-semibold underline-offset-4 hover:underline"
            >
              {post.author.displayName}
            </Link>
            <h4 className="text-xs font-semibold text-muted-foreground">
              {post.author.StudentData.name}
            </h4>
            <div className="flex items-center pt-2">
              <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
              <span className="text-xs text-muted-foreground">
                {`Joined ${date}`}
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default ProfileHover;
