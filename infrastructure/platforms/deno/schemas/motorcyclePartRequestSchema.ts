import { z } from "npm:zod";

export const addMotorcyclePartRequestSchema = z.object({
  motorcycleId: z.string().uuid("Invalid UUID format"),
  partId: z.string().uuid("Invalid UUID format"),
});

export const updateMotorcyclePartRequestSchema = addMotorcyclePartRequestSchema.partial();
