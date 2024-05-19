import * as z from "zod";

export const ChatValidation = z.object({
  senderId: z.string().min(1),
  text: z.string().min(1),
  parentId: z.string().optional().nullable(),
});

export const ReactionValidation = z.object({
  userId: z.string().min(1),
  reaction: z.string().min(1),
});

export const RoomValidation = z.object({
  name: z
    .string()
    .min(5, "Room name should be atleast 5 characters")
    .max(15, "Room name should not exceed 15 characters"),
});
