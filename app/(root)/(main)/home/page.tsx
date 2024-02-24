import Feed from "@/components/ui/feed";
import { getUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

export default async function Home() {
  const currentUser = await getUser();

  if (currentUser?.onboarded === false) {
    redirect("/onboarding");
  }
  return (
    <section className="flex min-h-[400px] space-x-3">
      <Feed />
      <div className="flex-1 border"></div>
    </section>
  );
}
