import { MaintenanceEntity } from "../../../domain/entities/MaintenanceEntity";
import { MaintenanceRepository } from "../../repositories/MaintenanceRepository";

export class FindMaintenanceUsecase {
    constructor(private maintenanceRepository: MaintenanceRepository) {}
  
    async execute(id: string) {
      return await this.maintenanceRepository.findOneById(id);
    }
  }
  