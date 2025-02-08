import { MaintenanceEntity } from "../../domain/entities/MaintenanceEntity.ts";
import { MaintenanceNotFoundError } from "../../domain/errors/MaintenanceNotFoundError.ts";
import { EntityRepositoryInterface } from "./EntityRepositoryInterface.ts";

export interface MaintenanceRepository extends EntityRepositoryInterface<MaintenanceEntity> {
  save(maintenance: MaintenanceEntity): Promise<void>;
  findAll(): Promise<MaintenanceEntity[]>;
  findOneById(id: string): Promise<MaintenanceEntity | MaintenanceNotFoundError>;
  delete(id: string): Promise<void>;
  findScheduledMaintenances(date: Date): Promise<MaintenanceEntity[]>;
}
