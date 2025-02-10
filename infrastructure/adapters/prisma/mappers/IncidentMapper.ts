import { IncidentType } from "../../../../domain/enum/IncidentEnum.ts";
import * as Prisma from "../../../database/prisma/generated/client-deno/deno/edge.ts";

export const mapIncidentTypeToPrismaIncidentType = (type: IncidentType): Prisma.IncidentType => {
  switch (type) {
    case IncidentType.BREAKDOWN:
      return Prisma.IncidentType.breakdown;
    case IncidentType.ACCIDENT:
      return Prisma.IncidentType.accident;
    default:
      throw new Error(`Unknown type: ${type}`);
  }
}
