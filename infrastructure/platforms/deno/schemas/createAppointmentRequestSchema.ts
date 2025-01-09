import { z } from "npm:zod";

export const createAppointmentRequestSchema = z.object({
  date: z.date({ coerce: true }),
  motorcycleId: z.string().uuid(),
});
