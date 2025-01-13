import { z } from "npm:zod";

export const createMotoRequestSchema = z.object({
  model: z.string().min(1, "Model is required"),
  registrationNumber: z.string().min(1, "Registration number is required"),
  status: z.enum(["active", "inactive", "sold"], { errorMap: () => ({ message: "Invalid status" }) }),
  partId: z.string().uuid().optional(),
});
