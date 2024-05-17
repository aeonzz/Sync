import * as z from "zod";

export const EventValidation = z.object({
  name: z.string().min(2, {
    message: "Event name must be at least 2 characters.",
  }),
  description: z.string().min(5, {
    message: "description must be at least 5 characters.",
  }),
  date: z.date({
    required_error: "Thedate is required.",
  }),
});
