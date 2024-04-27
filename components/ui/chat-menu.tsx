"use client";

import NewChat from "./new-chat";

const ChatMenu = () => {
  return (
    <div className="h-20 w-[300px] border border-white">
      <div className="flex justify-between">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Chat rooms
        </h3>
        <NewChat />
      </div>
    </div>
  );
};

export default ChatMenu;
