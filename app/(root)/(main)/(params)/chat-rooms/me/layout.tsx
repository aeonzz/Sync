import ChatMenu from "@/components/shared/chat-menu";
import Memenu from "@/components/shared/me-menu";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth");
  }

  return (
    <section className="flex w-full">
      <Memenu currentUserId={session.user.id} />
      <div className="h-screen flex-1 bg-card/90">{children}</div>
    </section>
  );
}
