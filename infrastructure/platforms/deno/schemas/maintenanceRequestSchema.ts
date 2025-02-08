import { z } from "zod";

export const addMaintenanceRequestSchema = z.object({
  date: z.coerce.date()
    .min(new Date(1900, 0, 1), "Date must be after 1900")
    .max(new Date(), "Date cannot be in the future"),
  description: z.string().min(1, "Description cannot be empty"),
  motorcycleId: z.string().uuid("Invalid UUID format"),
  cost: z.number().positive("Cost must be positive"),
  nextMaintenanceDate: z.coerce.date(),
});

export const updateMaintenanceRequestSchema = addMaintenanceRequestSchema.partial();
