import type { MaintenanceEntity } from "../../domain/entities/MaintenanceEntity.ts";

export interface MaintenanceRepository {
  save(maintenance: MaintenanceEntity): Promise<void>;
  findAll(): Promise<MaintenanceEntity[]>;
  findOneById(id: string): Promise<MaintenanceEntity | null>;
  delete(id: string): Promise<void>;  
}
