import { z } from "npm:zod";

export const createMaintenanceRequestSchema = z.object({
  date: z.date({ coerce: true }).min(1900, "Invalid year").max(new Date().getFullYear(), "Year cannot be in the future"),
  description: z.string().min(1, "Description cannot be empty"),
  motorcycleId: z.string().uuid().min(1, "Motorcycle id is required"),
  cost: z.number().positive().min(1, "Cost must be greater than 0"),
});

export const updateMaitenanceRequestSchema = createMaintenanceRequestSchema.extend()