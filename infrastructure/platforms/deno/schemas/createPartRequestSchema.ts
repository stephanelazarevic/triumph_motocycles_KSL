import { z } from "npm:zod";

export const createPartRequestSchema = z.object({
  commandIdentifier: z.string().min(1, "Command identifier is required."),
  reference: z.string().min(3, "Reference must be at least 3 characters."),
  type: z.string(),
  price: z.number().min(0, "Price must be non-negative."),
  stockQuantity: z.number().min(0, "Stock quantity must be non-negative."),
});
