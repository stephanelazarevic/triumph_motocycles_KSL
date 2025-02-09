import { z } from "zod";
import { addIncidentRequestSchema } from "./incidentRequestSchema.ts";
import { addMaintenanceRequestSchema } from "./maintenanceRequestSchema.ts";

const motorcycleHistorySchema = z.object({
  motorcycleId: z.string().uuid("Invalid motorcycle UUID"),
  startDate: z.date()
    .min(new Date(1900, 0, 1), "Date must be after 1900")
    .max(new Date(), "Date cannot be in the future"),
  endDate: z.date().nullable()
    .min(new Date(1900, 0, 1), "Date must be after 1900")
    .max(new Date(), "Date cannot be in the future"),
  incidents: z.array(addIncidentRequestSchema).default([]), 
  maintenances: z.array(addMaintenanceRequestSchema).default([]),
  clientId: z.string().uuid("Invalid client UUID format").nullable(),
  drivers: z.array(z.string().uuid("Invalid driver UUID format")).nullable(),
  enterpriseId: z.string().uuid("Invalid enterprise UUID format").nullable(),
})

export const addMotorcycleHistoryRequestSchema = motorcycleHistorySchema
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

export const updateMotorcycleHistoryRequestSchema = motorcycleHistorySchema.partial()
.refine(data => !(data.clientId && data.driverId),
  {
    message: "Cannot assign a motorcycle to both a client and a driver",
    path: ["clientId", "driverId"],
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