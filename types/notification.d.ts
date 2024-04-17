import { Notification, NotificationType } from "@prisma/client";

export type NotificationProps = {
  id: number;
  recipientId: string;
  text: string;
  type: NotificationType;
  from: {
    id: string;
    username: string | null;
    avatarUrl: string | null;
  };
  resourceId: string;
  isRead: boolean;
  createdAt: Date;
};
