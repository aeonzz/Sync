import ChatMenu from "@/components/ui/chat-menu";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth");
  }
  return (
    <div className="mt-5 h-screen w-[740px] border border-white">
      <ChatMenu currentUserId={session.user.id} />
    </div>
  );
};

export default page;
