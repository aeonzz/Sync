import RightSideBar from "@/components/shared/right-sidebar";
import Feed from "@/components/ui/feed";
import FetchDataError from "@/components/ui/fetch-data-error";
import { getUserById } from "@/lib/actions/user.actions";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const currentUser = await getUserById(session!.user.id);
  if (!currentUser.data || currentUser.error) {
    return <FetchDataError />;
  }

  if (!currentUser.data.onboarded) {
    redirect("/onboarding");
  }

  return (
    <>
      <div className="min-h-[400px] w-[550px]">
        <Feed session={session} />
      </div>
      <div className="relative w-[425px]">
        <div className="fixed top-[94px] h-[calc(100vh-110px)] w-[425px] overflow-hidden rounded-md">
          <RightSideBar />
        </div>
      </div>
    </>
  );
}
