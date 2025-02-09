import { z } from 'npm:zod';

export const signInRequestSchema = z.object({
  emailAddress: z
    .string()
    .email('Email invalide')
    .min(1, 'Email requis'),
  password: z
    .string()
    .min(1, 'Mot de passe requis')
});