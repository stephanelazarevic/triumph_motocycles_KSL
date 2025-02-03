import { z } from "npm:zod";

export const addDriverRequestSchema = z.object({
  enterpriseId: z.string().uuid("Invalid UUID format"),
  motorcycleId: z.string().uuid("Invalid UUID format"),
  firstname: z.string().min(2),
  lastname: z.string().min(2),
  licenseNumber: z.number().int(),
  phoneNumber: z.string().min(8).max(15),
  emailAddress: z.string().email(),
});

export const updateDriverRequestSchema = addDriverRequestSchema.partial();
