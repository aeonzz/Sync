"use client";

import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./button";
import { LogOut, Settings, UserRound } from "lucide-react";
import Logout from "./logout";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { UserProps } from "@/types/user";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface UserNavProps {
  currentUserId: string;
}

const UserNav: React.FC<UserNavProps> = ({ currentUserId }) => {
  const pathname = usePathname();
  const chatRooms = pathname.startsWith("/chat-rooms");
  const { data } = useQuery<UserProps>({
    queryFn: async () => {
      const response = await axios.get(`/api/user/${currentUserId}`);
      return response.data.data;
    },
    queryKey: ["current-user-data"],
  });

  if (!data) return null;

  const initialLetter = data.username?.charAt(0).toUpperCase();
  const fullname = `${data.studentData.firstName} ${data.studentData.middleName.charAt(0).toUpperCase()} ${data.studentData.lastName}`;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="lg"
          className={cn(
            chatRooms ? "w-fit" : "w-full",
            "mb-3 flex h-[52px] justify-start border bg-card p-2 shadow-sm transition-all duration-300",
          )}
        >
          <Avatar>
            <AvatarImage
              src={data.avatarUrl ? data.avatarUrl : undefined}
              alt={data.username ? data.username : "No avatar"}
            />
            <AvatarFallback>{initialLetter}</AvatarFallback>
          </Avatar>
          {!chatRooms && (
            <div
              className={cn(
                chatRooms && "opacity-0 duration-300",
                "ml-2 flex flex-col items-start space-y-1",
              )}
            >
              <p className="text-sm font-medium leading-none">
                {data.username}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {fullname}
              </p>
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={cn(chatRooms ? "w-auto" : "w-[230px]", "z-50")}
        align={chatRooms ? "end" : "center"}
        side={chatRooms ? "right" : "bottom"}
        alignOffset={-115}
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{data.username}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {data.studentId}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={`/u/${currentUserId}`}>
              <UserRound className="mr-2 h-5 w-5" />
              Profile
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <Logout />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserNav;
