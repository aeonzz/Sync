import * as z from "zod";

export const PostValidation = z.object({
  title: z.string().optional(),
  content: z.string().min(1, {
    message: "Description must be at least 1 character.",
  }),
});

export const commentValidation = z.object({
  comment: z.string().min(1, {
    message: "Comments must be at least 1 character."
  })
})
