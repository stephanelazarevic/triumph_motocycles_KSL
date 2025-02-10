import { PrismaClient } from "../../../../infrastructure/database/prisma/generated/client-deno/deno/edge.ts";
import { load } from "https://deno.land/std@0.208.0/dotenv/mod.ts";

const env = await load();

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: env.DATABASE_URL
    }
  }
});
