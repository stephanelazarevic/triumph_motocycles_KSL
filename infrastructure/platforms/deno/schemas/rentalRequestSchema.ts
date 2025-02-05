import { z } from "zod";

export const addRentalRequestSchema = z.object({
 clientId: z.string().uuid("Invalid UUID format"),
 motorcycleId: z.string().uuid("Invalid UUID format"),   
 startDate: z.coerce.date()
   .min(new Date(1900, 0, 1), "Date must be after 1900")
   .max(new Date(), "Date cannot be in the future"),
 endDate: z.coerce.date()
   .min(new Date(1900, 0, 1), "Date must be after 1900")
   .max(new Date(), "Date cannot be in the future"),
 cost: z.number().int(),
 isCompleted: z.boolean(),
})

export const updateRentalRequestSchema = addRentalRequestSchema.partial();
