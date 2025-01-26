import { MaintenanceRepository } from "../../repositories/MaintenanceRepository.ts";
import { MaintenanceNotFoundError } from "../../../domain/errors/MaintenanceNotFoundError.ts";

export class DeleteMaintenanceUsecase {
  constructor(private maintenanceRepository: MaintenanceRepository) {}

  public async execute(id: string): Promise<MaintenanceNotFoundError | void> {
    const existing = await this.maintenanceRepository.findOneById(id);
    if (!existing) {
      return new MaintenanceNotFoundError();
    }
    await this.maintenanceRepository.delete(id);
  }
}
