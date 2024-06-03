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

const UserNav = () => {
  const session = useSession();

  const { data } = useQuery<UserProps>({
    queryFn: async () => {
      const response = await axios.get(`/api/user/${session.data?.user.id}`);
      return response.data.data;
    },
    queryKey: ["current-user-data"],
  });

  console.log(data)

  if (!data) return null;

  // const initialLetter = data.username?.charAt(0).toUpperCase();
  // const fullname = `${data.studentData.firstName} ${data.studentData.middleName.charAt(0).toUpperCase()} ${data.studentData.lastName}`;

  return (
    <DropdownMenu modal={false}>
      {/* <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="lg"
          className="mb-3 flex h-[52px] w-[230px] justify-start space-x-2 border bg-card px-3 shadow-sm"
        >
          <Avatar>
            <AvatarImage
              src={data.avatarUrl ? data.avatarUrl : undefined}
              alt={data.username ? data.username : "No avatar"}
            />
            <AvatarFallback>{initialLetter}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start space-y-1">
            <p className="text-sm font-medium leading-none">{data.username}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {fullname}
            </p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-50 w-[230px]" align="center" forceMount>
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
            <Link href={`/u/${session.data?.user.id}`}>
              <UserRound className="mr-2 h-5 w-5" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-5 w-5" />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <Logout />
      </DropdownMenuContent> */}
    </DropdownMenu>
  );
};

export default UserNav;
