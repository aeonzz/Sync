import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { BadgeCheck, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileHoverProps {
  username?: string;
  date?: string;
  userId?: number;
  imageUrl?: string;
  className?: string;
}

const ProfileHover: React.FC<ProfileHoverProps> = ({
  username,
  date,
  userId,
  imageUrl,
  className,
}) => {
  const profile = imageUrl ? imageUrl : undefined;

  let initialLetter = "";
  if (username) {
    initialLetter = username.charAt(0).toUpperCase();
  }

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Avatar
          className={cn(
            className,
            "group relative h-9 w-9 border bg-stone-900 dark:border",
          )}
        >
          <Link href={`/user/${userId}`} className="relative">
            <div className="absolute z-10 h-9 w-9 bg-stone-950 opacity-0 transition group-hover:opacity-40"></div>
            <AvatarImage src={profile} className="object-cover" />
            <AvatarFallback className="h-9 w-9 pb-1 pr-1">
              {initialLetter}
            </AvatarFallback>
          </Link>
        </Avatar>
      </HoverCardTrigger>
      <HoverCardContent
        className="z-50 w-[250px]"
        hideWhenDetached={true}
        align="start"
      >
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage src={profile} className="object-cover" />
            <AvatarFallback className="h-9 w-9 bg-stone-900">
              {initialLetter}
            </AvatarFallback>
          </Avatar>
          <div className="w-full space-y-1">
            <h4 className="text-sm font-semibold"></h4>
            <Link
              href={`/user/${userId}`}
              className=" flex items-center gap-1 text-sm underline-offset-4 hover:underline"
            >
              {username}
            </Link>
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
