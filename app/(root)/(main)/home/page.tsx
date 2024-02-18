import CreatePost from "@/components/ui/create-post";
import ProfileNav from "@/components/ui/profile-nav";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession(authOptions)
  return (
    <main className="min-h-[400px] flex-1 px-5 pt-5">
      <div className="flex items-center justify-between">
        <CreatePost session={session} />
        <ProfileNav />
      </div>
    </main>
  );
}
