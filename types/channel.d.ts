import { ChannelStatus, ChannelType, User } from "@prisma/client";
import { MessageProps } from "./message";

export type ChannelProps = {
  id: string;
  type: ChannelType;
  status: ChannelStatus;
  createdAt: Date;
  members: {
    user: User;
  }[];
};

export type ExtendedChannelProps = ChannelProps & {
  messages: MessageProps[];
};
