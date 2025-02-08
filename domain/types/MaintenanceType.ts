import { MaintenanceStatus, MaintenanceType } from "../enum/MaintenanceEnum";

export interface AddMaintenanceCommand {
  date: Date,
  description: string,
  motorcycleId: string,
  cost: number,
  type: MaintenanceType,
  status: MaintenanceStatus,
}

export interface UpdateMaintenanceCommand extends Partial<AddMaintenanceCommand>{}
