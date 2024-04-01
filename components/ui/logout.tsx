"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { DropdownMenuItem } from "./dropdown-menu";

const Logout = () => {
  return (
    <DropdownMenuItem
      onClick={() =>
        signOut({
          redirect: true,
          callbackUrl: `${window.location.origin}/auth`,
        })
      }
      className="text-red-600 hover:!text-red-600"
    >
      <LogOut className="mr-2 h-5 w-5 stroke-red-600" />
      Logout
    </DropdownMenuItem>
  );
};

export default Logout;
