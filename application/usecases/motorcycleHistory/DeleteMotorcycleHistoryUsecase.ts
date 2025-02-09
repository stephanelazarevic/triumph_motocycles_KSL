import { MotorcycleHistoryRepository } from "../../repositories/MotorcycleHistoryRepository.ts";
import { MotorcycleHistoryNotFoundError } from "../../../domain/errors/MotorcycleHistoryNotFoundError.ts";

export class DeleteMotorcycleHistoryUsecase {
  constructor(private motorcycleHistoryRepository: MotorcycleHistoryRepository) {}

  public async execute(id: string): Promise<MotorcycleHistoryNotFoundError | void> {
    const existingMotorcycleHistory = await this.motorcycleHistoryRepository.findOneById(id);
    if (!existingMotorcycleHistory) {
      return new MotorcycleHistoryNotFoundError();
    }

    await this.motorcycleHistoryRepository.delete(id);
  }
}
