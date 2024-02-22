"use client";

import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./button";
import { LogOut, UserRound } from "lucide-react";
import { Skeleton } from "./skeleton";

const ProfileNav = () => {
  const { data: session, status } = useSession();
  const initialLetter = session?.user.username?.charAt(0).toUpperCase();

  if (status === "loading") {
    return <Skeleton className="h-12 w-[251px]" />;
  }

  if (!session) return null;
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="lg"
          className="flex h-[52px] space-x-2 bg-card px-5 shadow-sm"
        >
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>{initialLetter}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start space-y-1">
            <p className="text-sm font-medium leading-none">
              {session.user.username}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session.user.email}
            </p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[252px]" align="center" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session.user.username}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session.user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <UserRound className="mr-2 h-5 w-5" />
            Profile
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuItem
          onClick={() =>
            signOut({
              redirect: true,
              callbackUrl: `${window.location.origin}/login`,
            })
          }
          className="text-red-600 hover:!text-red-600"
        >
          <LogOut className="mr-2 h-5 w-5 stroke-red-600" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileNav;
