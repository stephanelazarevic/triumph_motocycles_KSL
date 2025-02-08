import { PrismaClient } from "../../../database/prisma/generated/client-deno/deno/edge.ts";
import { withAccelerate } from '@prisma/extension-accelerate'
import { load } from "https://deno.land/std/dotenv/mod.ts";

await load({ export: true });

export const prisma = new PrismaClient().$extends(withAccelerate())
