import type { MaintenanceRepository } from "../../../application/repositories/MaintenanceRepository.ts";
import type { MaintenanceEntity } from "../../../domain/entities/MaintenanceEntity.ts";

export class MaintenanceRepositoryInMemory implements MaintenanceRepository {
  public constructor(private maintenances: MaintenanceEntity[]) {}

  public save(maintenance: MaintenanceEntity): Promise<void> {
    const index = this.maintenances.findIndex(maintenance => maintenance.identifier === maintenance.identifier);
    if (index === -1) {
      this.maintenances.push(maintenance);
    } else {
      this.maintenances[index] = maintenance;
    }
    return Promise.resolve();
  }

  public findAll(): Promise<MaintenanceEntity[]> {
    return Promise.resolve(this.maintenances);
  }

  async findOneById(id: string): Promise<MaintenanceEntity | null> {
    const foundMaintenance = this.maintenances.find((maintenance) => {
      return maintenance.identifier === id;
    });

    return Promise.resolve(foundMaintenance ?? null);
  }

  async delete(id: string): Promise<void> {
    this.maintenances = this.maintenances.filter(maintenance => maintenance.identifier !== id);
  }
}
