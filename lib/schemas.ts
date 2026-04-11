import { z } from "zod";

export const feedbackItemSchema = z.object({
  id: z.string().min(1, "Feedback items must include an id."),
  source: z.string().min(1, "Feedback items must include a source."),
  customer: z.string().min(1, "Feedback items must include a customer."),
  text: z.string().min(1, "Feedback items must include text.")
});

export const feedbackRequestSchema = z.object({
  feedback: z.array(feedbackItemSchema).min(1, "No feedback supplied.")
});
