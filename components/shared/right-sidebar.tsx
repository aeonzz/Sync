import { getServerSession } from "next-auth";
import PopularUsers from "./popular-users";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import RecentEvents from "./recent-events";
import RecentAnnouncement from "./recent-announcement";
import { ScrollArea } from "../ui/scroll-area";

const RightSideBar = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth");
  }

  return (
    <ScrollArea scrollBarColor="bg-transparent">
      <div className="w-full space-y-3">
        <RecentAnnouncement />
        <RecentEvents />
        <PopularUsers currentUserId={session.user.id} />
      </div>
    </ScrollArea>
  );
};

export default RightSideBar;
