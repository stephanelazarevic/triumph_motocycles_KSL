import { z } from "zod";

export const addWarrantyRequestSchema = z.object({
 startDate: z.coerce.date()
   .min(new Date(1900, 0, 1), "Date must be after 1900")
   .max(new Date(), "Date cannot be in the future"),
 endDate: z.coerce.date()
   .min(new Date(1900, 0, 1), "Date must be after 1900")
   .max(new Date(), "Date cannot be in the future"),
 type: z.string().min(1, "The type cannot be empty"),
 motorcycleId: z.string().uuid("Invalid UUID format"),
 terms: z.string().min(1, "The terms cannot be empty"),
})

export const updateWarrantyRequestSchema = addWarrantyRequestSchema.partial();
