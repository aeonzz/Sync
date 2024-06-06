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
import { UserRoleType } from "@prisma/client";

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
            "mb-3 flex h-auto justify-start border bg-card p-2 shadow-sm transition-all duration-300",
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
              <p className="whitespace-pre-wrap break-words text-sm font-medium leading-none text-start">
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
          {data.role === UserRoleType.SYSTEMADMIN && (
            <DropdownMenuItem asChild>
              <Link href="/dashboard">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width={20}
                  height={20}
                  color={"#ededed"}
                  fill={"none"}
                  className="mr-2"
                >
                  <path
                    d="M20 22V17C20 15.1144 20 14.1716 19.4142 13.5858C18.8284 13 17.8856 13 16 13L12 22L8 13C6.11438 13 5.17157 13 4.58579 13.5858C4 14.1716 4 15.1144 4 17V22"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 15L11.5 19L12 20.5L12.5 19L12 15ZM12 15L11 13H13L12 15Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15.5 6.5V5.5C15.5 3.567 13.933 2 12 2C10.067 2 8.5 3.567 8.5 5.5V6.5C8.5 8.433 10.067 10 12 10C13.933 10 15.5 8.433 15.5 6.5Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Admin
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <Logout />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserNav;
