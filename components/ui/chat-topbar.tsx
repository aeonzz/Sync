import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { ChannelProps } from "@/types/channel";

interface ChatTopBarProps {
  channel: ChannelProps;
}

const ChatTopBar: React.FC<ChatTopBarProps> = ({ channel }) => {
  const chatPartner = channel.members[0];

  return (
    <div className="flex h-16 w-full items-center p-4 border-b">
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
    </div>
  );
};

export default ChatTopBar;
