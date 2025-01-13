import { z } from "npm:zod";

export const createMotoPartRequestSchema = z.object({
  clientId: z.string().uuid().optional(),
  dealerId: z.string().uuid().optional(),
  model: z.string().min(1, "Model is required"),
  registrationNumber: z.string().min(1, "Registration number is required"),
  status: z.enum(["active", "inactive", "sold"], { errorMap: () => ({ message: "Invalid status" }) }),
});
