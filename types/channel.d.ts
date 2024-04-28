import { ChannelType, User } from "@prisma/client";

export type ChannelProps = {
  id: string;
  type: ChannelType;
  isAccepted: boolean;
  createdAt: Date;
  members: {
    user: User;
  }[];
};
