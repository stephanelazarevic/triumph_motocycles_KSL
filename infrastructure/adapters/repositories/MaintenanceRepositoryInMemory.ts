import { MaintenanceRepository } from "../../../application/repositories/MaintenanceRepository.ts";
import { MaintenanceEntity } from "../../../domain/entities/MaintenanceEntity.ts";
import { MaintenanceNotFoundError } from "../../../domain/errors/MaintenanceNotFoundError.ts";

export class MaintenanceRepositoryInMemory implements MaintenanceRepository {
  public constructor(private maintenances: MaintenanceEntity[]) {}

  public save(maintenance: MaintenanceEntity): Promise<void> {
    const index = this.maintenances.findIndex(
      (maintenance) => maintenance.id === maintenance.id,
    );
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

  public findOneById(id: string): Promise<MaintenanceEntity | MaintenanceNotFoundError> {
    const foundMaintenance = this.maintenances.find((maintenance) => {
      return maintenance.id === id;
    });

    return Promise.resolve(foundMaintenance ?? new MaintenanceNotFoundError());
  }

  public delete(id: string): Promise<void> {
    this.maintenances = this.maintenances.filter(
      (maintenance) => maintenance.id !== id,
    );
    return Promise.resolve();
  }

  public findScheduledMaintenances(date: Date): Promise<MaintenanceEntity[]> {
    return Promise.resolve(this.maintenances.filter(
      (maintenance) => maintenance.nextMaintenanceDate <= date
    ));
  }
}
