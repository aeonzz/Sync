import ChatMenu from "@/components/shared/chat-menu";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth");
  }


  return (
    <section className="sticky top-0 flex h-auto w-full">
      <ChatMenu currentUserId={session.user.id} />
      {children}
    </section>
  );
}
