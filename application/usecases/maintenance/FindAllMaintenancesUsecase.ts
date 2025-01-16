import { MaintenanceEntity } from "domain/entities/MaintenanceEntity.ts";
import type { MaintenanceRepository } from "application/repositories/MaintenanceRepository.ts";

export class FindAllMaintenancesUsecase {
  public constructor(
    private readonly maintenanceRepository: MaintenanceRepository
  ) {}

  public async execute(): Promise<MaintenanceEntity[]> {
    return await this.maintenanceRepository.findAll();
  }
}
