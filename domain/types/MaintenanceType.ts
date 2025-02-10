import { MotorcycleEntity } from "../entities/MotorcycleEntity.ts";
import { MaintenanceStatus, MaintenanceType } from "../enum/MaintenanceEnum.ts";

export interface AddMaintenanceCommand {
  date: Date,
  description: string,
  motorcycle: MotorcycleEntity,
  cost: number,
  type: MaintenanceType,
  status: MaintenanceStatus,
  nextMaintenanceDate: Date,
}

export interface UpdateMaintenanceCommand extends Partial<AddMaintenanceCommand>{}
