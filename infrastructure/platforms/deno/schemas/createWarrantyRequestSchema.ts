import { z } from "npm:zod";

export const createWarrantyRequestSchema = z.object({
  startDate: z.date({ coerce: true }),
  endDate: z.date({ coerce: true }),
  warrantyType: z.string().min(1, "The type cannot be empty"),
  motorcycleId: z.string().uuid(),
  terms: z.string().min(1, "The terms cannot be empty"),
});
