import { MaintenanceStatus, MaintenanceType } from "../../../../domain/enum/MaintenanceEnum.ts";
import * as Prisma from "../../../database/prisma/generated/client-deno/deno/edge.ts";

export const mapMaintenanceTypeToPrismaMaintenanceType = (type: MaintenanceType): Prisma.MaintenanceType => {
  switch (type) {
    case MaintenanceType.CHECK:
      return Prisma.MaintenanceType.check;
    case MaintenanceType.REPAIR:
      return Prisma.MaintenanceType.repair;
    default:
      throw new Error(`Unknown type: ${type}`);
  }
}

export const mapMaintenanceStatusToPrismaMaintenanceStatus = (status: MaintenanceStatus): Prisma.MaintenanceStatus => {
  switch (status) {
    case MaintenanceStatus.IN_PROGRESS:
      return Prisma.MaintenanceStatus.in_progress;
    case MaintenanceStatus.DONE:
      return Prisma.MaintenanceStatus.done;
    case MaintenanceStatus.CANCELED:
      return Prisma.MaintenanceStatus.canceled;
    default:
      throw new Error(`Unknown type: ${status}`);
  }
}
