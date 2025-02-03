import { MaintenanceRepository } from "../../repositories/MaintenanceRepository.ts";
import { MotorcycleRepository } from "../../repositories/MotorcycleRepository.ts";
import { UpdateMaintenanceCommand } from "../../../domain/types/MaintenanceType.ts";
import { MaintenanceEntity } from "../../../domain/entities/MaintenanceEntity.ts";

export class UpdateMaintenanceUsecase {
  constructor(
    private maintenanceRepository: MaintenanceRepository,
    private motorcycleRepository: MotorcycleRepository
  ) {}

  public async execute(maintenanceId: string, command: UpdateMaintenanceCommand): Promise<MaintenanceEntity | Error> {
    const maintenance = await this.maintenanceRepository.findOneById(maintenanceId);
    if (maintenance instanceof Error) {
      return maintenance;
    }

    if (command.motorcycleId) {
      const motorcycle = await this.motorcycleRepository.findOneById(command.motorcycleId);
      if (motorcycle instanceof Error) {
        return motorcycle;
      }
      maintenance.motorcycle = motorcycle;
    }

    if (command.date) {
      maintenance.date = command.date;
    }
    if (command.description) {
      maintenance.description = command.description;
    }
    if (command.cost) {
      maintenance.cost = command.cost;
    }

    maintenance.markAsUpdated();
    await this.maintenanceRepository.save(maintenance);
    return maintenance;
  }
}
