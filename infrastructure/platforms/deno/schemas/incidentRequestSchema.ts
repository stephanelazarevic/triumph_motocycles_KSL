import { z } from "npm:zod";
import { IncidentType } from "../../../../domain/enum/IncidentEnum.ts";

export const createIncidentRequestSchema = z.object({
  description: z.string().min(1, "Description cannot be empty"),
  motorcycleId: z.string().uuid().min(1, "Motorcycle id is required"),
  type: z.nativeEnum(IncidentType, { errorMap: () => ({ message: "Invalid incident type" }) }).min(1, "Incident type is required"),
  reportDate: z.date({ coerce: true }).min(1900, "Invalid year").max(new Date().getFullYear(), "Year cannot be in the future"),
  resolutionDate: z.date({ coerce: true }).min(1900, "Invalid year").max(new Date().getFullYear(), "Year cannot be in the future"),
  status: z.string().min(1, "Status cannot be empty"),
});

export const updateIncidentRequestSchema = createIncidentRequestSchema.extend()