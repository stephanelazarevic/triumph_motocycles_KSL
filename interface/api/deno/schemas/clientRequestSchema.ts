import { z } from "npm:zod";
import { createUserRequestSchema } from "../schemas/userRequestSchema.ts"

export const addClientRequestSchema = z.object({
  user: createUserRequestSchema,
  dealerId: z.string().uuid("Invalid UUID format")
});

export const updateDriverRequestSchema = addClientRequestSchema.partial();
