import { MaintenanceEntity } from "../../../domain/entities/MaintenanceEntity.ts";
import { MotorcycleNotFoundError } from "../../../domain/errors/MotorcycleNotFoundError.ts";
import { AddMaintenanceCommand } from "../../../domain/types/MaintenanceType.ts";
import type { MaintenanceRepository } from "../../repositories/MaintenanceRepository.ts";
import type { MotorcycleRepository } from "../../repositories/MotorcycleRepository.ts";

export class AddMaintenanceUsecase {
  public constructor(
    private readonly maintenanceRepository: MaintenanceRepository,
    private readonly motorcycleRepository: MotorcycleRepository,
  ) {}

  public async execute(command: AddMaintenanceCommand): Promise<MaintenanceEntity | Error> {

    const maintenance = MaintenanceEntity.create({
      date: command.date,
      description: command.description,
      motorcycleId: command.motorcycleId,
      cost: command.cost,
      type: command.type,
      status: command.status,
      nextMaintenanceDate: command.nextMaintenanceDate,
    });

    await this.maintenanceRepository.save(maintenance);
    return maintenance;
  }
}
