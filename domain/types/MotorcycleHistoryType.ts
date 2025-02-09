import { DriverEntity } from "../entities/DriverEntity.ts";
import { IncidentEntity } from "../entities/IncidentEntity.ts";
import { MaintenanceEntity } from "../entities/MaintenanceEntity.ts";

export interface AddMotorcycleHistoryCommand {
  motorcycleId: string,
  startDate: Date,
  endDate: Date | null,
  incidents: IncidentEntity[],
  maintenances: MaintenanceEntity[],
  clientId: string | null,
  drivers: DriverEntity[] | null,
  enterpriseId: string | null,
}

export interface UpdateMotorcycleHistoryCommand extends Partial<AddMotorcycleHistoryCommand>{}
