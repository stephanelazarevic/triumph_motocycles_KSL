import { MaintenanceEntity } from "../../../domain/entities/MaintenanceEntity";
import { MaintenanceRepository } from "../../repositories/MaintenanceRepository";
import { MaintenanceNotFoundError } from "../../../domain/errors/MaintenanceNotFoundError.ts";

export class UpdateMaintenanceUsecase {
    constructor(private maintenanceRepository: MaintenanceRepository) {}
  
    async execute(maintenance: MaintenanceEntity): Promise<MaintenanceNotFoundError | void> {
      const existing = await this.maintenanceRepository.findOneById(maintenance.identifier);
      if (!existing) {
        return new MaintenanceNotFoundError();
      }
      await this.maintenanceRepository.save(maintenance);
    }
  }
  