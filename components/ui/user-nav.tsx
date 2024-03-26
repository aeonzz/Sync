import { signOut } from "next-auth/react";
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
import { getUserById } from "@/lib/actions/user.actions";
import Logout from "./logout";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import FetchDataError from "./fetch-data-error";

const UserNav = async () => {
  const session = await getServerSession(authOptions);
  const currentUser = await getUserById(session!.user.id);
  if (!currentUser.data || currentUser.error) {
    return <FetchDataError />;
  }

  const initialLetter = currentUser.data.username?.charAt(0).toUpperCase();
  const fullname = `${currentUser.data.StudentData.firstName} ${currentUser.data.StudentData.middleName.charAt(0).toUpperCase()} ${currentUser.data.StudentData.lastName}`;

  if (!currentUser) return null;
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="lg"
          className="flex h-[52px] w-[200px] justify-start space-x-2 border bg-card px-3 shadow-sm"
        >
          <Avatar>
            <AvatarImage
              src={
                currentUser.data.avatarUrl
                  ? currentUser.data.avatarUrl
                  : undefined
              }
              alt={
                currentUser.data.username
                  ? currentUser.data.username
                  : "No avatar"
              }
            />
            <AvatarFallback>{initialLetter}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start space-y-1">
            <p className="text-sm font-medium leading-none">
              {currentUser.data.username}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {fullname}
            </p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-50 w-[200px]" align="center" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {currentUser.data.username}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {currentUser.data.studentId}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={`/u/${session?.user.id}`}>
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserNav;
