import { MaintenanceRepository } from "../../repositories/MaintenanceRepository.ts";
import { MaintenanceNotFoundError } from "../../../domain/errors/MaintenanceNotFoundError.ts";

export class DeleteMaintenanceUsecase {
  constructor(private maintenanceRepository: MaintenanceRepository) {}

  public async execute(id: string): Promise<MaintenanceNotFoundError | void> {
    const existingMaintenance = await this.maintenanceRepository.findOneById(id);
    if (!existingMaintenance) {
      return new MaintenanceNotFoundError();
    }

    await this.maintenanceRepository.delete(id);
  }
}
