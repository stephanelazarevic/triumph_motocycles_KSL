import { MotorcycleHistoryNotFoundError } from "../../../domain/errors/MotorcycleHistoryNotFoundError.ts";
import { MotorcycleHistoryRepository } from "../../repositories/MotorcycleHistoryRepository.ts";
import { MotorcycleHistoryService } from "../../services/MotorcycleHistoryService.ts";

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