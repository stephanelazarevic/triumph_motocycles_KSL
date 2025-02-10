import { z } from "npm:zod";
import { createUserRequestSchema } from "../schemas/userRequestSchema.ts"

export const addDealerRequestSchema = z.object({
  user: createUserRequestSchema,
  site: z.string().min(1, "site is required")
});

export const updateDealerRequestSchema = addDealerRequestSchema.partial();
