import React from "react";
import CreatePost from "../ui/create-post";
import { ThemeToggle } from "../ui/theme-toggle";
import ProfileNav from "../ui/profile-nav";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const TopBar = async () => {
  const session = await getServerSession(authOptions);

  return (
    <header className="sticky top-0 z-[100] flex w-full items-center justify-between bg-background/50 py-5 backdrop-blur-sm backdrop-filter">
      <CreatePost session={session} />
      <div className="flex items-center space-x-2">
        <ThemeToggle />
        <ProfileNav />
      </div>
    </header>
  );
};

export default TopBar;
