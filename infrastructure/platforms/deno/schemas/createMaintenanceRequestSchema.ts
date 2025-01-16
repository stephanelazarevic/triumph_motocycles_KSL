import { z } from "npm:zod";

export const createMaintenanceRequestSchema = z.object({
  date: z.date({ coerce: true }),
  description: z.string().min(1, "Description cannot be empty"),
  motorcycleId: z.string().uuid(),
  cost: z.number().positive(),
});
