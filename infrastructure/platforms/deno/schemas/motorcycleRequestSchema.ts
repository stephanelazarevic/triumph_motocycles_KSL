import { z } from 'npm:zod';
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
  drivers: z.string().array().optional(),
  clientId: z.string().uuid("Invalid client UUID format").optional(),
  enterpriseId: z.string().uuid("Invalid enterprise UUID format").optional(),
});

export const addMotorcycleRequestSchema = motorcycleSchema
  .refine(data => !(data.clientId && data.drivers), {
    message: "Cannot assign a motorcycle to both a client and a driver",
    path: ["clientId", "drivers"],
  })
  .refine(data => !(data.clientId && data.enterpriseId), {
    message: "A motorcycle cannot have both a client and an enterprise assigned",
    path: ["clientId", "enterpriseId"],
  })
  .refine(data => !data.drivers || (data.drivers.length === 0 || data.enterpriseId), {
    message: "A motorcycle with drivers must have an enterprise assigned",
    path: ["drivers"],
  });

export const updateMotorcycleRequestSchema = motorcycleSchema.partial()
  .refine(data => !(data.clientId && data.drivers), {
    message: "Cannot assign a motorcycle to both a client and a driver",
    path: ["clientId", "drivers"],
  }
  )
  .refine(data => !(data.clientId && data.enterpriseId), {
    message: "A motorcycle cannot have both a client and an enterprise assigned",
    path: ["clientId", "enterpriseId"],
  })
  .refine(data => !data.drivers || (data.drivers.length === 0 || data.enterpriseId), {
    message: "A motorcycle with drivers must have an enterprise assigned",
    path: ["drivers"],
  });
