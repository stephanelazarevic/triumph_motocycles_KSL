import { z } from "npm:zod";
import { IncidentType } from "../../../../domain/enum/IncidentEnum.ts";

export const createIncidentRequestSchema = z.object({
  description: z.string().min(1, "Description cannot be empty"),
  motorcycleId: z.string().uuid(),
  type: z.nativeEnum(IncidentType, { errorMap: () => ({ message: "Invalid incident type" }) }),
  reportDate: z.date({ coerce: true }),
  resolutionDate: z.date({ coerce: true }),
  status: z.string().min(1, "Status cannot be empty"),
});
