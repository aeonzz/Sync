import {
  AccessibilityType,
  ApprovalStatusType,
  EventStatusType,
  Reservation,
  Venue,
} from "@prisma/client";
import { UserProps } from "./user";

export type EventProps = {
  id: string;
  name: string;
  description: string;
  accessibility: AccessibilityType;
  location: string;
  approvalStatus: ApprovalStatusType;
  eventStatus: EventStatusType;
  image: string | null;
  blurDataUrl: string | undefined;
  deleted: boolean;
  venue: Venue;
  createdAt: Date;
  updatedAt: Date;
  organizer: UserProps;
  attendees: UserProps[];
  reservation: Reservation;
};
