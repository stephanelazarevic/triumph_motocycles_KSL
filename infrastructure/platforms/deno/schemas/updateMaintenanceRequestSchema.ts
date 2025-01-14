import { z } from "npm:zod";
import { createMaintenanceRequestSchema } from "./createMaintenanceRequestSchema";

export const updateMaintenanceRequestSchema = createMaintenanceRequestSchema
.partial()
.extend({
    date: z.date({ coerce: true }),
    description: z.string().min(1, "Description cannot be empty"),
    motorcycleId: z.string().uuid(),
    cost: z.number().positive(),
  });
