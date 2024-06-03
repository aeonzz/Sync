import React from "react";
import CreatePost from "../ui/create-post";
import { ThemeToggle } from "../ui/theme-toggle";
import UserNav from "../ui/user-nav";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserById } from "@/lib/actions/user.actions";
import FetchDataError from "../ui/fetch-data-error";

const TopBar = async () => {
  const session = await getServerSession(authOptions);
  const currentUser = await getUserById(session!.user.id);
  
  if (!currentUser.data || currentUser.error) {
    return <FetchDataError />;
  }

  return (
    <header className="sticky top-0 z-40 flex w-full items-center justify-between bg-background py-5">
      <CreatePost currentUser={currentUser.data} announcement={false} />
      <div className="flex items-center space-x-2">
        <ThemeToggle />
        <UserNav />
      </div>
    </header>
  );
};

export default TopBar;
