import { ChannelStatus, ChannelType, User } from "@prisma/client";

export type ChannelProps = {
  id: string;
  type: ChannelType;
  status: ChannelStatus;
  createdAt: Date;
  members: {
    user: User;
  }[];
};
