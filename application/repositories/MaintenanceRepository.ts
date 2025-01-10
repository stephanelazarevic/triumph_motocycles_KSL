import type { MaintenanceEntity } from "../../domain/entities/MaintenanceEntity.ts";

export interface MaintenanceRepository {
  save(maintenance: MaintenanceEntity): Promise<void>;
  all(): Promise<MaintenanceEntity[]>;
}
