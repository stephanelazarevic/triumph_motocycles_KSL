import { MaintenanceEntity } from "../../../domain/entities/MaintenanceEntity.ts";
import { EmptyListError } from "../../../domain/errors/EmptyListError.ts";
import type { MaintenanceRepository } from "../../repositories/MaintenanceRepository.ts";

export class FindAllMaintenancesUsecase {
  public constructor(
    private readonly maintenanceRepository: MaintenanceRepository,
  ) {}

  public async execute(): Promise<MaintenanceEntity[] | EmptyListError> {
    const existing = await this.maintenanceRepository.findAll();
      if (!existing) {
        return new EmptyListError();
      }
      return existing
  }
}
