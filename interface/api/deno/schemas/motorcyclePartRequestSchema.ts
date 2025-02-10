import { z } from 'npm:zod';

export const addMotorcyclePartRequestSchema = z.object({
  motorcycleId: z.string().uuid("Invalid dealer UUID"),
  partId: z.string().uuid("Invalid dealer UUID"),
});

export const updateMotorcyclePartRequestSchema = addMotorcyclePartRequestSchema.partial();
