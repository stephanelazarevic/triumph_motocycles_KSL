import { MotorcycleHistoryEntity } from "../../../domain/entities/MotorcycleHistoryEntity.ts";
import { InvalidDateError } from "../../../domain/errors/InvalidDateError.ts";
import { AddMotorcycleHistoryCommand } from "../../../domain/types/MotorcycleHistoryType.ts";
import type { MotorcycleHistoryRepository } from "../../repositories/MotorcycleHistoryRepository.ts";

export class AddMotorcycleHistoryUsecase {
  public constructor(
    private readonly motorcycleHistoryRepository: MotorcycleHistoryRepository,
  ) {}

    public async execute(command: AddMotorcycleHistoryCommand): Promise<MotorcycleHistoryEntity | Error> {
        
    if(command.endDate !== null && command.startDate > command.endDate) {
        return new InvalidDateError("La date départ ne peut pas être postérieure à celle de fin.");
    }    

    const motorcycleHistory = MotorcycleHistoryEntity.create({
      motorcycleId: command.motorcycleId,
      startDate: command.startDate,
      endDate: command.endDate,
      incidents: command.incidents,
      maintenances: command.maintenances,
      clientId: command.clientId,
      drivers: command.drivers,
      enterpriseId: command.enterpriseId,
    });

    if(motorcycleHistory instanceof Error){
      return motorcycleHistory;
    }

    await this.motorcycleHistoryRepository.save(motorcycleHistory);
    return motorcycleHistory;
    
  }
}
