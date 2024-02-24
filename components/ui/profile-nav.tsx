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
import { getUser } from "@/lib/actions/user.actions";
import Logout from "./logout";

const ProfileNav = async () => {
  const currentUser = await getUser();
  const initialLetter = currentUser?.username?.charAt(0).toUpperCase();

  if (!currentUser) return null;
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="lg"
          className="flex h-[52px] space-x-2 border bg-card px-5 shadow-sm"
        >
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>{initialLetter}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start space-y-1">
            <p className="text-sm font-medium leading-none">
              {currentUser?.username}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {currentUser?.studentId}
            </p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-50 w-[252px]" align="center" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {currentUser?.username}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {currentUser?.studentId}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <UserRound className="mr-2 h-5 w-5" />
            Profile
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

export default ProfileNav;
