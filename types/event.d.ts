import {
  AccessibilityType,
  ApprovalStatusType,
  EventStatusType,
} from "@prisma/client";
import { UserProps } from "./user";

export type EventProps = {
  id: string;
  name: string;
  description: string;
  accessibility: AccessibilityType;
  date: Date;
  location: string;
  approvalStatus: ApprovalStatusType;
  eventStatus: EventStatusType;
  image: string | null;
  blurDataUrl: string | undefined;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  organizer: UserProps;
  attendees: UserProps[];
};
