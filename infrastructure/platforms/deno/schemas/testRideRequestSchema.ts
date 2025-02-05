import { z } from "npm:zod";

export const addTestRideRequestSchema = z.object({
  clientId: z.string().uuid("Invalid UUID format"),
  motorcycleId: z.string().uuid("Invalid UUID format"),
  date: z.coerce.date()
    .min(new Date(1900, 0, 1), "Date must be after 1900"),
  feedback: z.string().min(1, "Feedback cannot be empty"),
  isCompleted: z.boolean()
});

export const updateTestRideRequestSchema = addTestRideRequestSchema.partial();
