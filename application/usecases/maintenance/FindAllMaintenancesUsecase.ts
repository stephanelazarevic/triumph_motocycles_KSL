import type { MaintenanceRepository } from "../../repositories/MaintenanceRepository.ts";

export class FindAllMaintenancesUsecase {
  public constructor(
    private readonly maintenanceRepository: MaintenanceRepository,
  ) {}

  public execute() {
    return this.maintenanceRepository.findAll();
  }
}
