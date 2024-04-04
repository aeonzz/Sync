import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { BadgeCheck, CalendarDays } from "lucide-react";
import { PostProps } from "@/types/post";
import { format } from "date-fns";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProfileHoverProps {
  className?: string | undefined;
  authorId: string;
  avatarUrl: string | null;
  coverUrl: string;
  userJoined: Date;
  username: string | null;
  firstName: string;
  middleName: string;
  lastName: string;
  department: string;
  side?: "top" | "right" | "bottom" | "left" | undefined;
  align?: "center" | "start" | "end" | undefined;
  sideOffset?: number | undefined;
}

const ProfileHover: React.FC<ProfileHoverProps> = ({
  authorId,
  avatarUrl,
  className,
  coverUrl,
  userJoined,
  username,
  firstName,
  middleName,
  lastName,
  department,
  side,
  align,
  sideOffset,
}) => {
  const profile = avatarUrl ? avatarUrl : undefined;
  const authorCreatedAt = new Date(userJoined);
  const date = format(authorCreatedAt, "PP");
  const initialLetter = username?.charAt(0).toUpperCase();
  const fullname = `${firstName} ${middleName.charAt(0).toUpperCase()} ${lastName}`;

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Link href={`/u/${authorId}`} className="group relative">
          <div
            className={cn(
              className,
              "absolute z-50 h-9 w-9 rounded-full bg-card/30 opacity-0 transition group-hover:opacity-100",
            )}
          />
          <Avatar className={cn(className)}>
            <AvatarImage src={profile} className="object-cover" alt={profile} />
            <AvatarFallback>{initialLetter}</AvatarFallback>
          </Avatar>
        </Link>
      </HoverCardTrigger>
      <HoverCardContent
        className="w-[250px] space-y-4"
        hideWhenDetached={true}
        sideOffset={sideOffset ? sideOffset : 10}
        side={side}
        align={align}
      >
        <div className="relative h-16 w-[250px]">
          <Image
            src={coverUrl}
            alt={coverUrl}
            fill
            objectFit="cover"
            objectPosition="center"
          />
          <Avatar className="absolute -bottom-8 left-3 h-16 w-16 border-2 border-popover">
            <AvatarImage src={profile} alt={profile} />
            <AvatarFallback>{initialLetter}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex justify-between space-x-4 p-4">
          <div className="w-full space-y-1">
            <Link
              href={`/u/${authorId}`}
              className="flex items-center text-xl font-semibold underline-offset-4 hover:underline"
            >
              {username}
            </Link>
            <h4 className="text-xs text-muted-foreground">{fullname}</h4>
            <h4 className="text-xs text-muted-foreground">{department}</h4>
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
