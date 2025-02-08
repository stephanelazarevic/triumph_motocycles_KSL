import { MotorcycleStatus } from "../../../../domain/enum/MotorcycleEnum.ts";
import * as Prisma from "../../../database/prisma/generated/client-deno/deno/edge.ts";

export const mapMotorcycleStatusToPrismaMotorcycleStatus = (status: MotorcycleStatus): Prisma.MotorcycleStatus => {
  switch (status) {
    case MotorcycleStatus.AVAILABLE:
      return Prisma.MotorcycleStatus.available;
    case MotorcycleStatus.RENTED:
      return Prisma.MotorcycleStatus.rented;
    case MotorcycleStatus.IN_MAINTENANCE:
      return Prisma.MotorcycleStatus.in_maintenance;
    default:
      throw new Error(`Unknown status: ${status}`);
  }
}
