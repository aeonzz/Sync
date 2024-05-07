import { UserProps } from "./user";

export type MessageProps = {
  id: string;
  sequenceId: int;
  senderId: string;
  channelId: string;
  text: string;
  sender: UserProps;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  messageReaction: MessageReactionProps[];
};

export type MessageVariable = {
  userId: string;
  text: string;
};

export type MessageReactionProps = {
  id: string;
  messageId: string;
  reaction: string;
  user: UserProps;
};
