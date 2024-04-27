import ExplorePage from "@/components/screens/explore-page";
import CreatePost from "@/components/ui/create-post";
import ExploreSearch from "@/components/ui/explore-search";
import FetchDataError from "@/components/ui/fetch-data-error";
import { getUserById } from "@/lib/actions/user.actions";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

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
    <div className="w-[550px]">
      <ExploreSearch />
      <ExplorePage session={session} />
    </div>
  );
}
