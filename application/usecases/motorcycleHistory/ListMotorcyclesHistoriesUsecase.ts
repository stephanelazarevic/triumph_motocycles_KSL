import { MotorcycleHistoryRepository } from "../../repositories/MotorcycleHistoryRepository.ts";
import { MotorcycleHistoryService } from "../../services/MotorcycleHistoryService.ts";

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