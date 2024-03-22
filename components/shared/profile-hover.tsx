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
import Image from "next/image";

interface ProfileHoverProps {
  post: PostProps;
  className?: string;
}

const ProfileHover: React.FC<ProfileHoverProps> = ({ post, className }) => {
  const profile = post.author.avatarUrl ? post.author.avatarUrl : undefined;
  const authorCreatedAt = new Date(post.author.createdAt);
  const date = format(authorCreatedAt, "PP");
  const initialLetter = post.author.username?.charAt(0).toUpperCase();
  const fullname = `${post.author.StudentData.firstName} ${post.author.StudentData.middleName.charAt(0).toUpperCase()} ${post.author.StudentData.lastName}`;

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Link href={`/u/${post.author.id}`} className="group relative">
          <div className="absolute z-50 h-9 w-9 rounded-full bg-card/30 opacity-0 transition group-hover:opacity-100" />
          <Avatar>
            <AvatarImage src={profile} className="object-cover" alt={profile} />
            <AvatarFallback>{initialLetter}</AvatarFallback>
          </Avatar>
        </Link>
      </HoverCardTrigger>
      <HoverCardContent
        className="w-[250px] space-y-4"
        hideWhenDetached={true}
        sideOffset={10}
        align="start"
      >
        <div className="relative h-16 w-[250px]">
          <Image
            src={post.author.coverUrl ? post.author.coverUrl : "asdasd"}
            alt={post.author.coverUrl ? post.author.coverUrl : "asdasd"}
            fill
            objectFit="cover"
            objectPosition="center"
          />
          <Avatar className="absolute -bottom-8 left-3 w-16 h-16 border-2 border-popover">
            <AvatarImage src={profile} alt={profile} />
            <AvatarFallback>{initialLetter}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex justify-between space-x-4 p-4">
          <div className="w-full space-y-1">
            <Link
              href={`/u/${post.author.id}`}
              className="flex items-center text-xl font-semibold underline-offset-4 hover:underline"
            >
              {post.author.username}
            </Link>
            <h4 className="text-xs text-muted-foreground">
              {fullname}
            </h4>
            <h4 className="text-xs text-muted-foreground">
              {post.author.StudentData.department}
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
