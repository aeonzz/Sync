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

  if (currentUser.data.onboarded === false) {
    redirect("/onboarding");
  }

  return (
    <section className="min-h-[400px]">
      <Feed session={session} />
    </section>
  );
}

