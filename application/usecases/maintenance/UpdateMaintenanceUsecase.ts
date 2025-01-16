import { MaintenanceEntity } from "domain/entities/MaintenanceEntity.ts";
import { MaintenanceRepository } from "application/repositories/MaintenanceRepository.ts";
import { MaintenanceNotFoundError } from "domain/errors/MaintenanceNotFoundError.ts";

export class UpdateMaintenanceUsecase {
  constructor(private maintenanceRepository: MaintenanceRepository) {}

  public async execute(
    maintenance: MaintenanceEntity
  ): Promise<MaintenanceNotFoundError | void> {
    const existing = await this.maintenanceRepository.findOneById(
      maintenance.identifier
    );
    if (!existing) {
      return new MaintenanceNotFoundError();
    }
    await this.maintenanceRepository.save(maintenance);
  }
}
