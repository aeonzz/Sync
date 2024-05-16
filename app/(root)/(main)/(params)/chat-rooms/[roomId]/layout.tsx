import NotFound from "@/app/not-found";
import RoomMenu from "@/components/shared/room-menu";
import { checkRoomId } from "@/lib/actions/chat.actions";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { roomId: string };
}>) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth");
  }

  const response = await checkRoomId(params.roomId);

  if (response.data === false) {
    return (
      <div className="w-full">
        <NotFound />
      </div>
    );
  }

  return (
    <section className="flex h-screen w-full">
      <RoomMenu roomId={params.roomId} currentUserId={session.user.id} />
      <div className="flex-1 bg-card/90">{children}</div>
    </section>
  );
}
