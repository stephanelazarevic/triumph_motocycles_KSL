import { MotorcycleHistoryNotFoundError } from "../../../domain/errors/MotorcycleHistoryNotFoundError";
import { MotorcycleHistoryRepository } from "../../repositories/MotorcycleHistoryRepository";
import { MotorcycleHistoryService } from "../../services/MotorcycleHistoryService";

export class GetLastMotorcycleHistoryUsecase {
    constructor(
      private motorcycleHistoryRepository: MotorcycleHistoryRepository,
      private motorcycleHistoryService: MotorcycleHistoryService
    ) {}
  
    async execute(motorcycleId: string) {
      const motorcycleHistory = await this.motorcycleHistoryRepository.findLastByMotorcycleId(motorcycleId);
      if (motorcycleHistory instanceof MotorcycleHistoryNotFoundError) {
        throw motorcycleHistory;
      }
      return await this.motorcycleHistoryService.enrichMotorcycleHistories(motorcycleHistory);
  }
}