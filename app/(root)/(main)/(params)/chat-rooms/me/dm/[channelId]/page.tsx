import NotFound from "@/app/not-found";
import ChatMessages from "@/components/ui/chat-messages";
import ChatTopBar from "@/components/ui/chat-topbar";
import FetchDataError from "@/components/ui/fetch-data-error";
import { getChannelById } from "@/lib/actions/chat.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

interface ChatProps {
  params: {
    channelId: string;
  };
}

const Chat: React.FC<ChatProps> = async ({ params }) => {
  const { channelId } = params;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const channel = await getChannelById(channelId, session.user.id);

  if (channel.error) {
    return <FetchDataError />;
  }

  if (!channel.data) {
    return <NotFound />;
  }

  const currentUser = await getUserById(session.user.id);
  if (!currentUser.data || currentUser.error) {
    return <FetchDataError />;
  }

  if (!currentUser.data.onboarded) {
    redirect("/onboarding");
  }


  return (
    <div className="flex h-screen flex-col pb-3">
      <ChatTopBar channel={channel.data} room={false} />
      <ChatMessages channel={channel.data} currentUser={currentUser.data} room={false} />
    </div>
  );
};

export default Chat;
