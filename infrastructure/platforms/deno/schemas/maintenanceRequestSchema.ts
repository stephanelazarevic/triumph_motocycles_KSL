import { z } from 'npm:zod';
import { MaintenanceStatus, MaintenanceType } from '../../../../domain/enum/MaintenanceEnum.ts';
import { addMotorcycleRequestSchema } from "./motorcycleRequestSchema.ts";

export const addMaintenanceRequestSchema = z.object({
  date: z.coerce.date()
    .min(new Date(1900, 0, 1), "Date must be after 1900")
    .max(new Date(), "Date cannot be in the future"),
  description: z.string().min(1, "Description cannot be empty"),
  motorcycle: z.object(addMotorcycleRequestSchema),
  type: z.nativeEnum(MaintenanceType, {
    errorMap: () => ({ message: "Invalid maintenance type" })
  }),
  status: z.nativeEnum(MaintenanceStatus),
  cost: z.number().positive("Cost must be positive"),
  nextMaintenanceDate: z.coerce.date(),
});

export const updateMaintenanceRequestSchema = addMaintenanceRequestSchema.partial();
