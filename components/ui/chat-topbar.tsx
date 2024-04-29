import { Card, CardContent, CardHeader } from "./card";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { ChannelProps } from "@/types/channel";

interface ChatTopBarProps {
  channel: ChannelProps;
}

const ChatTopBar: React.FC<ChatTopBarProps> = ({ channel }) => {
  const chatPartner = channel.members[0];

  return (
    <Card className="flex h-16 mb-2 w-full items-center px-4">
      <div className="flex space-x-2 items-center">
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
        <p className="text-xs">{chatPartner.user.username}</p>
      </div>
    </Card>
  );
};

export default ChatTopBar;
