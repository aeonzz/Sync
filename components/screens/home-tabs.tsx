"use client";

import { UserProps } from "@/types/user";
import { Session } from "next-auth";
import CreatePost from "../ui/create-post";
import Feed from "./feed";
import { Button } from "../ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import FollowingTab from "./following-tab";

interface HomeTabsProps {
  session: Session;
  currentUserData: UserProps;
}

const HomeTabs: React.FC<HomeTabsProps> = ({ session, currentUserData }) => {
  const [isActive, setIsActive] = useState("feed");

  return (
    <div className="relative">
      <div className="sticky top-0 z-10 mb-4 flex h-14 w-full backdrop-blur-sm backdrop-filter dark:bg-background/50">
        <Button
          variant="tab"
          value="feed"
          onClick={() => setIsActive("feed")}
          className={cn(
            isActive === "feed"
              ? "border-b border-b-primary text-foreground"
              : "text-muted-foreground",
            "h-full flex-1",
          )}
        >
          Feed
        </Button>
        <Button
          variant="tab"
          value="following"
          onClick={() => setIsActive("following")}
          className={cn(
            isActive === "following"
              ? "border-b border-b-primary text-foreground"
              : "text-muted-foreground",
            "h-full flex-1",
          )}
        >
          Following
        </Button>
      </div>
      {isActive === "feed" ? (
        <>
          <CreatePost currentUser={currentUserData} />
          <Feed session={session} />
        </>
      ) : (
        <>
          <CreatePost currentUser={currentUserData} />
          <FollowingTab session={session} />
        </>
      )}
    </div>
  );
};

export default HomeTabs;
