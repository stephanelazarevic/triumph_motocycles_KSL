import type { MaintenanceRepository } from "../../../application/repositories/MaintenanceRepository.ts";
import type { MaintenanceEntity } from "../../../domain/entities/MaintenanceEntity.ts";

export class MaintenanceRepositoryInMemory implements MaintenanceRepository {
  public constructor(private readonly maintenances: MaintenanceEntity[]) {}

  public save(maintenance: MaintenanceEntity): Promise<void> {
    this.maintenances.push(maintenance);

    return Promise.resolve();
  }

  public all(): Promise<MaintenanceEntity[]> {
    return Promise.resolve(this.maintenances);
  }
}
