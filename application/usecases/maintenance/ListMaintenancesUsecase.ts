import { MaintenanceEntity } from "../../../domain/entities/MaintenanceEntity.ts";
import type { MaintenanceRepository } from "../../repositories/MaintenanceRepository.ts";

export class ListMaintenancesUsecase {
  public constructor(
    private readonly maintenanceRepository: MaintenanceRepository,
  ) {}

  public async execute(): Promise<MaintenanceEntity[]> {
    return await this.maintenanceRepository.findAll();
  }
}
