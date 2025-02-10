import { MotorcycleStatus } from "../../../../domain/enum/MotorcycleEnum.ts";
import * as Prisma from "../../../database/prisma/generated/client-deno/deno/edge.ts";

export const mapMotorcycleStatusToPrismaMotorcycleStatus = (status: MotorcycleStatus): Prisma.MotorcycleStatus => {
  switch (status) {
    case MotorcycleStatus.AVAILABLE:
      return "available";
    case MotorcycleStatus.RENTED:
      return "rented";
    case MotorcycleStatus.IN_MAINTENANCE:
      return "in_maintenance";
    default:
      throw new Error(`Unknown status: ${status}`);
  }
}
