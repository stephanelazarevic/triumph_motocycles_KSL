import { z } from "zod";

export const addPartRequestSchema = z.object({
 dealerId: z.string().uuid("Invalid user UUID"),
 reference: z.string().min(1, "Reference is required"),
 type: z.string().min(1, "Type is required"),
 price: z.number().int(),
 stockQuantity: z.number().int(),
})

export const updatePartRequestSchema = addPartRequestSchema.partial();
