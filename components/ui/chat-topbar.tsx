import { Hash } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { ChannelProps } from "@/types/channel";

interface ChatTopBarProps {
  channel: ChannelProps;
  room: boolean;
}

const ChatTopBar: React.FC<ChatTopBarProps> = ({ channel, room }) => {
  const chatPartner = channel.members[0];

  return (
    <div className="flex h-16 w-full items-center border-b p-4">
      {!room && chatPartner ? (
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={chatPartner.user.avatarUrl ?? undefined}
              className="object-cover"
              alt={chatPartner.user.avatarUrl ?? undefined}
            />
            <AvatarFallback>
              {chatPartner.user.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <p className="text-base">{chatPartner.user.username}</p>
        </div>
      ) : (
        <p className="inline-flex gap-1 font-semibold items-center">
          <Hash className="h-5 w-5" />
          {channel.channelName}
        </p>
      )}
    </div>
  );
};

export default ChatTopBar;
