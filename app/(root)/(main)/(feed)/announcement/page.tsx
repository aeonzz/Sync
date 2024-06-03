import CreatePost from "@/components/ui/create-post";
import FetchDataError from "@/components/ui/fetch-data-error";
import { getUserById } from "@/lib/actions/user.actions";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import HomeTabs from "@/components/screens/home-tabs";
import Feed from "@/components/screens/feed";
import Announcements from "@/components/screens/announcement";

export default async function Home() {
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
    <div>
      <div className="flex items-center justify-between my-4 space-x-6">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Announcements
        </h3>
        <CreatePost currentUser={currentUser.data} announcement />
      </div>
      <Announcements session={session} />
    </div>
  );
}
