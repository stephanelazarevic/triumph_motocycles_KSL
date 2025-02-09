import { MotorcycleHistoryRepository } from "../../../application/repositories/MotorcycleHistoryRepository.ts";
import { MotorcycleHistoryEntity } from "../../../domain/entities/MotorcycleHistoryEntity.ts";
import { MotorcycleHistoryNotFoundError } from "../../../domain/errors/MotorcycleHistoryNotFoundError.ts";

export class MotorcycleHistoryRepositoryInMemory implements MotorcycleHistoryRepository {
  public constructor(private motorcycleHistories: MotorcycleHistoryEntity[]) {}

  public save(motorcycleHistory: MotorcycleHistoryEntity): Promise<void> {
    this.motorcycleHistories.push(motorcycleHistory);

    return Promise.resolve();
  }

  public findAll(): Promise<MotorcycleHistoryEntity[]> {
    return Promise.resolve(this.motorcycleHistories);
  }

  public findOneById(id: string): Promise<MotorcycleHistoryEntity | MotorcycleHistoryNotFoundError> {
    const foundMotorcycleHistory = this.motorcycleHistories.find((motorcycleHistory) => {
      return motorcycleHistory.id === id;
    });

    return Promise.resolve(foundMotorcycleHistory ?? new MotorcycleHistoryNotFoundError());
  }

  public delete(id: string): Promise<void> {
    this.motorcycleHistories = this.motorcycleHistories.filter(
      (motorcycleHistory) => motorcycleHistory.id !== id,
    );
    return Promise.resolve();
  }

  public findByMotorcycleId(id: string): Promise<MotorcycleHistoryEntity[]> {
    const foundMotorcycleHistories = this.motorcycleHistories.filter((motorcycleHistory) => {
      return motorcycleHistory.motorcycleId === id;
    });

    return Promise.resolve(foundMotorcycleHistories);
  }

  public findLastByMotorcycleId(id: string): Promise<MotorcycleHistoryEntity | MotorcycleHistoryNotFoundError> {
    const foundMotorcycleHistory = this.motorcycleHistories
      .filter((motorcycleHistory) => motorcycleHistory.motorcycleId === id && motorcycleHistory.endDate === null)
      .sort((a, b) => b.startDate.getTime() - a.startDate.getTime())
      [0];

    return Promise.resolve(foundMotorcycleHistory ?? new MotorcycleHistoryNotFoundError());
  }
}
