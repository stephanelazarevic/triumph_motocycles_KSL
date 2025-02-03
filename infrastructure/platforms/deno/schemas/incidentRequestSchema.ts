import { z } from "npm:zod";
import { IncidentType } from "../../../../domain/enum/IncidentEnum.ts";

export const addIncidentRequestSchema = z.object({
  description: z.string().min(1, "Description cannot be empty"),
  motorcycleId: z.string().uuid("Invalid UUID format"),
  type: z.nativeEnum(IncidentType, {
    errorMap: () => ({ message: "Invalid incident type" })
  }),
  reportDate: z.coerce.date()
    .min(new Date(1900, 0, 1), "Date must be after 1900")
    .max(new Date(), "Date cannot be in the future"),
  resolutionDate: z.coerce.date()
    .min(new Date(1900, 0, 1), "Date must be after 1900")
    .max(new Date(), "Date cannot be in the future")
    .optional(),
  status: z.string().min(1, "Status cannot be empty"),
});

export const updateIncidentRequestSchema = addIncidentRequestSchema.partial();
