import type { MaintenanceEntity } from "../../domain/entities/MaintenanceEntity.ts";
import { EmptyListError } from "../../domain/errors/EmptyListError.ts";
import { MaintenanceNotFoundError } from "../../domain/errors/MaintenanceNotFoundError.ts";

export interface MaintenanceRepository {
  save(maintenance: MaintenanceEntity): Promise<void>;
  findAll(): Promise<MaintenanceEntity[] | EmptyListError>;
  findOneById(id: string): Promise<MaintenanceEntity | MaintenanceNotFoundError>;
  delete(id: string): Promise<void>;  
}
