"use client";

import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"

const Logout = () => {
  return (
    <div
      onClick={() => signOut({
        redirect: true,
        callbackUrl: `${window.location.origin}/login`
      })}
      className="flex items-center h-full w-full text-red-600 px-2 py-1.5"
    >
      <LogOut className="mr-2 h-4 w-4 stroke-red-600" />
      Sign out
    </div>
  );
};

export default Logout;