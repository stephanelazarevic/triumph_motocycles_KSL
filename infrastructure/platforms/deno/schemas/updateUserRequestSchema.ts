import { z } from "zod";
import { createUserRequestSchema } from "./createUserRequestSchema.ts";

export const updateUserRequestSchema = createUserRequestSchema.extend({
  id: z.string().uuid(),
}).partial();
