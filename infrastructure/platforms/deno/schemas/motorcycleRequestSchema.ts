import { z } from "zod";
import { MotorcycleStatus } from "../../../../domain/enum/MotorcycleEnum.ts";

const motorcycleSchema = z.object({
  dealerId: z.string().uuid("Invalid dealer UUID"),
  warrantyId: z.string().uuid("Invalid warranty UUID"),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().int()
    .min(1900, "Year must be after 1900")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
  registrationNumber: z.string()
    .min(1, "Registration number is required")
    .regex(/^[A-Z0-9-]+$/, "Invalid registration number format"),
  status: z.nativeEnum(MotorcycleStatus)
    .default(MotorcycleStatus.AVAILABLE),
  clientId: z.string().uuid("Invalid client UUID format").optional(),
  driverId: z.string().uuid("Invalid driver UUID format").optional(),
});

export const addMotorcycleRequestSchema = motorcycleSchema.refine(
  data => !(data.clientId && data.driverId),
  {
    message: "Cannot assign a motorcycle to both a client and a driver",
    path: ["clientId", "driverId"],
  }
);

export const updateMotorcycleRequestSchema = motorcycleSchema.partial().refine(
  data => !(data.clientId && data.driverId),
  {
    message: "Cannot assign a motorcycle to both a client and a driver",
    path: ["clientId", "driverId"],
  }
);
