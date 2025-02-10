import { MotorcycleEntity } from "../entities/MotorcycleEntity";
import { MaintenanceStatus, MaintenanceType } from "../enum/MaintenanceEnum";

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
