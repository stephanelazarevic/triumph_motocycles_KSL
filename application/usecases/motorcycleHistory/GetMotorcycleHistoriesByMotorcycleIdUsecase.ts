import { MotorcycleHistoryRepository } from "../../repositories/MotorcycleHistoryRepository";
import { MotorcycleHistoryService } from "../../services/MotorcycleHistoryService";

export class GetMotorcycleHistoriesByMotorcycleIdUsecase {
    constructor(
      private motorcycleHistoryRepository: MotorcycleHistoryRepository,
      private motorcycleHistoryService: MotorcycleHistoryService
    ) {}
  
    async execute(motorcycleId: string) {
      const motorcycleHistory = await this.motorcycleHistoryRepository.findByMotorcycleId(motorcycleId);
      return await this.motorcycleHistoryService.enrichMotorcycleHistories(motorcycleHistory);
  }
}