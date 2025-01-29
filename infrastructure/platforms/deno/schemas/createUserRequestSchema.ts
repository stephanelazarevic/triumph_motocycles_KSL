import { z } from "zod";

export const createUserRequestSchema = z.object({
  firstname: z.string().min(2),
  lastname: z.string().min(2),
  emailAddress: z.string().email(),
  plainPassword: z.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/\d/, { message: "Password must contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one symbol" }),
  phoneNumber: z.string().min(8).max(15),
  address: z.object({
    street: z.string().min(5),
    postalCode: z.string().min(5),
    countryCode: z.string().min(2)
  }),
  isAdministrator: z.boolean(),
});
