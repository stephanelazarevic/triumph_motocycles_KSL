import { MaintenanceEntity } from "../../domain/entities/MaintenanceEntity.ts";
import { MotorcycleNotFoundError } from "../../domain/errors/MotorcycleNotFoundError.ts";
import { AppointmentDate } from "../../domain/types/AppointmentDate.ts";
import type { MaintenanceRepository } from "../repositories/MaintenanceRepository.ts";
import type { MotorcycleRepository } from "../repositories/MotorcycleRepository.ts";

export class CreateMaintenanceUsecase {
  public constructor(
    private readonly maintenanceRepository: MaintenanceRepository,
    private readonly motorcycleRepository: MotorcycleRepository,
  ) {}

  public async execute(date: Date, motorcycleId: string, cost: number) {
    const motorcycle = await this.motorcycleRepository.findOneById(
      motorcycleId,
    );

    if (!motorcycle) {
      return new MotorcycleNotFoundError();
    }

    const maintenanceDateOrError = AppointmentDate.from(date);

    if (maintenanceDateOrError instanceof Error) {
      return maintenanceDateOrError;
    }

    const maintenance = MaintenanceEntity.create(
      maintenanceDateOrError,
      motorcycle,
      cost,
    );

    await this.maintenanceRepository.save(maintenance);
  }
}
