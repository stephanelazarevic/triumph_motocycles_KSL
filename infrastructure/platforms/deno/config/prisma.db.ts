import { PrismaClient } from "../../../database/prisma/generated/client-deno/deno/edge.ts";
import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";

const env = config();

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: env.DATABASE_URL
    }
  }
});
