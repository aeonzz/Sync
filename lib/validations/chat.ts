import * as z from "zod";

export const ChatValidation = z.object({
  senderId: z.string().min(1),
  text: z.string().min(1),
});
