import CreatePost from "@/components/ui/create-post";
import ProfileNav from "@/components/ui/profile-nav";

export default function Home() {
  return (
    <main className="min-h-[400px] flex-1 px-5 pt-5">
      <div className="flex items-center justify-between">
        <CreatePost />
        <ProfileNav />
      </div>
    </main>
  );
}
