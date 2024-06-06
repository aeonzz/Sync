import { getServerSession } from "next-auth";
import PopularUsers from "./popular-users";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import RecentEvents from "./recent-events";
import RecentAnnouncement from "./recent-announcement";
import { ScrollArea } from "../ui/scroll-area";
import { getUserById } from "@/lib/actions/user.actions";
import FetchDataError from "../ui/fetch-data-error";

const RightSideBar = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth");
  }

  const currentUser = await getUserById(session!.user.id);
  if (!currentUser.data || currentUser.error) {
    return <FetchDataError />;
  }

  if (!currentUser.data.onboarded) {
    redirect("/onboarding");
  }

  return (
    <ScrollArea scrollBarColor="bg-transparent">
      <div className="w-full space-y-3">
        <RecentAnnouncement currentUserData={currentUser.data} />
        <RecentEvents />
        <PopularUsers currentUserId={session.user.id} />
      </div>
    </ScrollArea>
  );
};

export default RightSideBar;
