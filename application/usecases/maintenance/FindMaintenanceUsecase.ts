import { MaintenanceEntity } from "../../../domain/entities/MaintenanceEntity.ts";
import { MaintenanceNotFoundError } from "../../../domain/errors/MaintenanceNotFoundError.ts";
import { MaintenanceRepository } from "../../repositories/MaintenanceRepository.ts";

export class FindMaintenanceUsecase {
  constructor(private maintenanceRepository: MaintenanceRepository) {}

  public async execute(id: string): Promise<MaintenanceEntity | MaintenanceNotFoundError> {
    const existing = await this.maintenanceRepository.findOneById(id);
    if (!existing) {
      return new MaintenanceNotFoundError();
    }
    return existing;
  }
}
