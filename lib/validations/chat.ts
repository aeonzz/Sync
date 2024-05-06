import * as z from "zod";

export const ChatValidation = z.object({
  senderId: z.string().min(1),
  text: z.string().min(1),
});

export const ReactionValidation = z.object({
  messageId: z.string().min(1),
  reaction: z.string().min(1),
});
