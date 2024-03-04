import React from "react";
import CreatePost from "../ui/create-post";
import { ThemeToggle } from "../ui/theme-toggle";
import ProfileNav from "../ui/profile-nav";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUser } from "@/lib/actions/user.actions";

const TopBar = async () => {
  const currentUser = await getUser();

  return (
    <header className="sticky top-0 z-40 flex w-full items-center justify-between bg-background py-5">
      <CreatePost currentUser={currentUser} />
      <div className="flex items-center space-x-2">
        <ThemeToggle />
        <ProfileNav />
      </div>
    </header>
  );
};

export default TopBar;
