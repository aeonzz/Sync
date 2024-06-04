"use client";

import { UserProps } from "@/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { createChannel } from "@/lib/actions/chat.actions";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

interface ConversationCardProps {
  user: UserProps;
  currentUserId: string;
  setIsOpen: (state: boolean) => void;
}

const ConversationCard: React.FC<ConversationCardProps> = ({
  user,
  currentUserId,
  setIsOpen,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  async function handleCreateChannel() {
    setIsLoading(true);

    const data = {
      to: user.id,
      from: currentUserId,
    };

    const response = await createChannel(data);

    if (response.status === 200) {
      queryClient.invalidateQueries({ queryKey: ["chat-cards"] });
      setIsOpen(false);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      toast.error("Uh oh! Something went wrong.", {
        description:
          "An error occurred while making the request. Please try again later",
      });
    }
  }

  // if (currentUserId === user.id) return null;

  return (
    <div className="mb-2 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Avatar>
          <AvatarImage
            src={user.avatarUrl ?? undefined}
            className="object-cover"
            alt={user.avatarUrl ?? undefined}
          />
          <AvatarFallback>
            {user.username?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm">{user.username}</p>
          <p className="text-xs text-muted-foreground">{`${user.studentData.firstName} ${user.studentData.middleName.charAt(0).toUpperCase()} ${user.studentData.lastName}`}</p>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        disabled={isLoading}
        onClick={handleCreateChannel}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width={20}
          height={20}
          fill={"none"}
          className="mr-2 text-primary"
        >
          <path
            d="M12.5 3.00372C11.6049 2.99039 10.7047 3.01289 9.8294 3.07107C5.64639 3.34913 2.31441 6.72838 2.04024 10.9707C1.98659 11.8009 1.98659 12.6607 2.04024 13.4909C2.1401 15.036 2.82343 16.4666 3.62791 17.6746C4.09501 18.5203 3.78674 19.5758 3.30021 20.4978C2.94941 21.1626 2.77401 21.495 2.91484 21.7351C3.05568 21.9752 3.37026 21.9829 3.99943 21.9982C5.24367 22.0285 6.08268 21.6757 6.74868 21.1846C7.1264 20.9061 7.31527 20.7668 7.44544 20.7508C7.5756 20.7348 7.83177 20.8403 8.34401 21.0513C8.8044 21.2409 9.33896 21.3579 9.8294 21.3905C11.2536 21.4852 12.7435 21.4854 14.1706 21.3905C18.3536 21.1125 21.6856 17.7332 21.9598 13.4909C22.0021 12.836 22.011 12.1627 21.9866 11.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8.5 15H15.5M8.5 10H12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15 5.5H22M18.5 2L18.5 9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Message
      </Button>
    </div>
  );
};

export default ConversationCard;
