import { MaintenanceEntity } from "../../../domain/entities/MaintenanceEntity.ts";
import { MaintenanceNotFoundError } from "../../../domain/errors/MaintenanceNotFoundError.ts";
import { MaintenanceRepository } from "../../repositories/MaintenanceRepository.ts";

export class GetMaintenanceUsecase {
  constructor(private maintenanceRepository: MaintenanceRepository) {}

  public async execute(id: string): Promise<MaintenanceEntity | MaintenanceNotFoundError> {
    const existingMaintenance = await this.maintenanceRepository.findOneById(id);
    if (!existingMaintenance) {
      return new MaintenanceNotFoundError();
    }
    return existingMaintenance;
  }
}
