import type { MaintenanceRepository } from "../repositories/MaintenanceRepository.ts";

export class ListMaintenancesUsecase {
  public constructor(
    private readonly maintenanceRepository: MaintenanceRepository,
  ) {}

  public execute() {
    return this.maintenanceRepository.all();
  }
}
