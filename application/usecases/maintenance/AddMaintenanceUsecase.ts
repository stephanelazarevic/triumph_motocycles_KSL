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

  public async execute(command: AddMaintenanceCommand): Promise<MaintenanceEntity | MotorcycleNotFoundError> {
    const motorcycle = await this.motorcycleRepository.findOneById(
      command.motorcycleId,
    );

    if (motorcycle instanceof MotorcycleNotFoundError) {
      throw motorcycle;
    }

    const maintenance = MaintenanceEntity.create({
      date: command.date,
      description: command.description,
      motorcycle,
      cost: command.cost,
    });

    await this.maintenanceRepository.save(maintenance);
    return maintenance;
  }
}
