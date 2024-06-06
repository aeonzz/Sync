import CreatePost from "@/components/ui/create-post";
import FetchDataError from "@/components/ui/fetch-data-error";
import { getUserById } from "@/lib/actions/user.actions";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import HomeTabs from "@/components/screens/home-tabs";
import Announcements from "@/components/screens/announcement";
import { UserRoleType } from "@prisma/client";

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
    <div className="min-h-screen w-[550px]">
      <div className="my-3 flex items-center justify-between">
        <h3 className="flex-1 scroll-m-20 text-2xl font-semibold tracking-tight">
          Announcements
        </h3>
        {currentUser.data.role !== UserRoleType.USER && (
          <div className="flex-1">
            <CreatePost currentUser={currentUser.data} announcement />
          </div>
        )}
      </div>
      <Announcements session={session} currentUserData={currentUser.data} />
    </div>
  );
}
