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
};

export type MessageVariable = {
  userId: string;
  text: string;
};
