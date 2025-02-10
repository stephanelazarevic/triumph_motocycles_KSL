import { MaintenanceEntity } from "../../../domain/entities/MaintenanceEntity.ts";
import { MotorcycleNotFoundError } from "../../../domain/errors/MotorcycleNotFoundError.ts";
import { AddMaintenanceCommand } from "../../../domain/types/MaintenanceType.ts";
import type { MaintenanceRepository } from "../../repositories/MaintenanceRepository.ts";

export class AddMaintenanceUsecase {
  public constructor(
    private readonly maintenanceRepository: MaintenanceRepository,
  ) {}

  public async execute(command: AddMaintenanceCommand): Promise<MaintenanceEntity | Error> {

    const maintenance = MaintenanceEntity.create({
      date: command.date,
      description: command.description,
      motorcycle: command.motorcycle,
      cost: command.cost,
      type: command.type,
      status: command.status,
      nextMaintenanceDate: command.nextMaintenanceDate,
    });

    await this.maintenanceRepository.save(maintenance);
    return maintenance;
  }
}
