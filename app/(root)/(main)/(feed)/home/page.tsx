import CreatePost from "@/components/ui/create-post";
import FetchDataError from "@/components/ui/fetch-data-error";
import { getUserById } from "@/lib/actions/user.actions";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import HomeTabs from "@/components/screens/home-tabs";

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
    <HomeTabs session={session} currentUserData={currentUser.data} />
  );
}
