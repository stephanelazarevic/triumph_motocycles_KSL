import { MaintenanceEntity } from "../../../domain/entities/MaintenanceEntity.ts";
import { MaintenanceRepository } from "../../repositories/MaintenanceRepository.ts";
import { MaintenanceNotFoundError } from "../../../domain/errors/MaintenanceNotFoundError.ts";

export class UpdateMaintenanceUsecase {
  constructor(private maintenanceRepository: MaintenanceRepository) {}

  public async execute(maitenanceId: string, updatedMaintenance: MaintenanceEntity): Promise<MaintenanceNotFoundError | void > {
    const mainteance = await this.maintenanceRepository.findOneById(maitenanceId);
    if (mainteance instanceof Error) {
      return mainteance;
    }

    mainteance.date = updatedMaintenance.date,
    mainteance.description = updatedMaintenance.description
    mainteance.motorcycle = updatedMaintenance.motorcycle
    mainteance.cost = updatedMaintenance.cost

    await this.maintenanceRepository.save(mainteance);
  }
}
