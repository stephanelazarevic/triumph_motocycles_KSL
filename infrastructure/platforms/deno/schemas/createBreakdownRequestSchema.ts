import { z } from "npm:zod";
import { BreakdownType } from "../../../../domain/enum/BreakdownEnum.ts";

export const createBreakdownRequestSchema = z.object({
  description: z.string().min(1, "Description cannot be empty"),
  motorcycleId: z.string().uuid(),
  type: z.nativeEnum(BreakdownType, { errorMap: () => ({ message: "Invalid breakdown type" }) }),
  reportDate: z.date({ coerce: true }),
  resolutionDate: z.date({ coerce: true }),
  status: z.string().min(1, "Status cannot be empty"),
});
