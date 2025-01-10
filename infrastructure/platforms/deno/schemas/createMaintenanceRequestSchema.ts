import { z } from "npm:zod";

export const createMaintenanceRequestSchema = z.object({
  date: z.date({ coerce: true }),
  motorcycleId: z.string().uuid(),
  cost: z.number().positive(),
});
