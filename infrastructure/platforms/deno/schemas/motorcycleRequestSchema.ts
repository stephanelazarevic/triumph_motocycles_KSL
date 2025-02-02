import { z } from "npm:zod";
import { MotorcycleStatus } from "../../../../domain/enum/MotorcycleEnum.ts";

export const createMotorcycleRequestSchema = z.object({
  dealerIdentifier: z.string().min(1, "Dealer identifier is required"),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().int().min(1900, "Invalid year").max(new Date().getFullYear(), "Year cannot be in the future"),
  registrationNumber: z.number().int().positive("Invalid registration number").min(1, "Registration number is required"),
  status: z.nativeEnum(MotorcycleStatus).default(MotorcycleStatus.AVAILABLE),
  clientIdentifier: z.string().optional(),
  driverIdentifier: z.string().optional(),
}).refine((data: { clientIdentifier: string; driverIdentifier: string; }) => !(data.clientIdentifier && data.driverIdentifier), {
  message: "Cannot assign a motorcycle to both a client and a driver",
  path: ["clientIdentifier", "driverIdentifier"],
});

export const updateMotorcycleRequestSchema = createMotorcycleRequestSchema.extend()