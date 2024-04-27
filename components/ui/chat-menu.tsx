"use client";

import { useQuery } from "@tanstack/react-query";
import NewChat from "./new-chat";
import axios from "axios";

interface ChatMenuProps {
  currentUserId: string;
}

const ChatMenu: React.FC<ChatMenuProps> = ({ currentUserId }) => {
  const { data } = useQuery({
    queryFn: async () => {
      const response = await axios.get("/api/chat/");
      return response.data.chats;
    },
    queryKey: ["chat-cards"],
  });

  return (
    <div className="h-20 w-[300px] border border-white">
      <div className="flex justify-between">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Chat rooms
        </h3>
        <NewChat currentUserId={currentUserId} />
      </div>
      <div>{}</div>
    </div>
  );
};

export default ChatMenu;
