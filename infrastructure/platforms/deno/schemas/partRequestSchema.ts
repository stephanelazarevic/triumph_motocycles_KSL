import { z } from 'npm:zod';

export const addPartRequestSchema = z.object({
  dealerId: z.string().uuid("Invalid UUID format"),
  reference: z.string().min(1, "Reference is required"),
  type: z.string().min(1, "Type is required"),
  price: z.number().int(),
  stockQuantity: z.number().int(),
  orderId: z.string().uuid("Invalid UUID format").optional(),
})

export const updatePartRequestSchema = addPartRequestSchema.partial();
