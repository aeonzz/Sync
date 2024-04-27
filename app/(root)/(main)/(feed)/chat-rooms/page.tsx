import ChatMenu from "@/components/ui/chat-menu";
import NewChat from "@/components/ui/new-chat";
import React from "react";

const page = () => {
  return (
    <div className="mt-5 h-screen w-[740px] border border-white">
      <ChatMenu />
    </div>
  );
};

export default page;
