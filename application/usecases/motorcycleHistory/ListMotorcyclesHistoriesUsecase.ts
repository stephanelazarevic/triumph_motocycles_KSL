import { MotorcycleHistoryRepository } from "../../repositories/MotorcycleHistoryRepository";
import { MotorcycleHistoryService } from "../../services/MotorcycleHistoryService";

export class ListMotorcyclesHistoriesUsecase {
    constructor(
      private motorcycleHistoryRepository: MotorcycleHistoryRepository,
      private motorcycleHistoryService: MotorcycleHistoryService
    ) {}
  
    async execute() {
        const motorcyclesHistories = await this.motorcycleHistoryRepository.findAll();
        return await this.motorcycleHistoryService.enrichMotorcycleHistories(motorcyclesHistories);
    }
}