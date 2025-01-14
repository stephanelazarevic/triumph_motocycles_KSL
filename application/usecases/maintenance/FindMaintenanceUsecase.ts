import { MaintenanceEntity } from "../../../domain/entities/MaintenanceEntity";
import { MaintenanceNotFoundError } from "../../../domain/errors/MaintenanceNotFoundError";
import { MaintenanceRepository } from "../../repositories/MaintenanceRepository";

export class FindMaintenanceUsecase {
    constructor(private maintenanceRepository: MaintenanceRepository) {}
  
    public async execute(id: string): Promise<MaintenanceEntity | MaintenanceNotFoundError> {
      const existing = await this.maintenanceRepository.findOneById(id);
      if (!existing) {
        return new MaintenanceNotFoundError();
      }
      return existing
    }
  }
  