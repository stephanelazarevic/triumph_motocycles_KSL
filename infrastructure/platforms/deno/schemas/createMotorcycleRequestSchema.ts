import { z } from "npm:zod";

export const createMotorcycleRequestSchema = z.object({
  brand: z.string(),
  model: z.string(),
  year: z.number(),
});
