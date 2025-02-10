import { MaintenanceRepository } from "../../repositories/MaintenanceRepository.ts";
import { UpdateMaintenanceCommand } from "../../../domain/types/MaintenanceType.ts";
import { MaintenanceEntity } from "../../../domain/entities/MaintenanceEntity.ts";

export class UpdateMaintenanceUsecase {
  constructor(
    private maintenanceRepository: MaintenanceRepository,
  ) {}

  public async execute(maintenanceId: string, command: UpdateMaintenanceCommand): Promise<MaintenanceEntity | Error> {
    const maintenance = await this.maintenanceRepository.findOneById(maintenanceId);
    if (maintenance instanceof Error) {
      return maintenance;
    }

    if (command.motorcycle) {
      maintenance.motorcycle = command.motorcycle;
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
    if (command.type) {
      maintenance.type = command.type;
    }
    if (command.status) {
      maintenance.status = command.status;
    }
    if (command.nextMaintenanceDate) {
      maintenance.nextMaintenanceDate = command.nextMaintenanceDate;
    }

    maintenance.markAsUpdated();
    await this.maintenanceRepository.save(maintenance);
    return maintenance;
  }
}
