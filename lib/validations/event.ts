import * as z from "zod";

export const EventValidation = z.object({
  name: z
    .string()
    .min(2, {
      message: "Event name must be at least 2 characters.",
    })
    .max(40, "Event name cannot exceed 40 characters"),
  description: z.string().min(5, {
    message: "description must be at least 5 characters.",
  }),
  location: z
    .string()
    .min(2, {
      message: "Add the event location",
    })
    .max(20, "Event location name cannot exceed 20 characters"),
  accessibility: z.string({
    required_error: "Please select from accessibility options",
  }),
  venueId: z.string({
    required_error: "Please select from venue options",
  }),
});
