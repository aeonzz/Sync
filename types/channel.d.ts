import { ChannelStatus, ChannelType, User } from "@prisma/client";
import { MessageProps } from "./message";

export type RoomProps = {
  id: string;
  roomName: string;
  channels: ChannelProps[];
};

export type ChannelProps = {
  id: string;
  type: ChannelType;
  status: ChannelStatus;
  createdAt: Date;
  channelName: string | null;
  members: {
    user: User;
  }[];
};

export type ExtendedChannelProps = ChannelProps & {
  messages: MessageProps[];
};
