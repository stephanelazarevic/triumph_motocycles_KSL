import { z } from 'npm:zod';

export const addWarrantyPartRequestSchema = z.object({
 warrantyId: z.string().uuid("Invalid warranty UUID"),
 partId: z.string().uuid("Invalid user UUID"),
 coveredCost: z.number().int(),
 remainingCost: z.number().int(),
})

export const updateWarrantyPartRequestSchema = addWarrantyPartRequestSchema.partial();
