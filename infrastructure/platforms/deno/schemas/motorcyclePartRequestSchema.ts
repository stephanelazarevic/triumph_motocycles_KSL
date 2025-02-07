import { z } from "zod";

export const addMotorcyclePartRequestSchema = z.object({
  motorcycleId: z.string().uuid("Invalid user UUID"),
  partId: z.string().uuid("Invalid user UUID"),
});

export const updateMotorcyclePartRequestSchema = addMotorcyclePartRequestSchema.partial();
