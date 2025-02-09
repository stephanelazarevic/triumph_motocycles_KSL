import { MotorcycleHistoryEntity } from "../../domain/entities/MotorcycleHistoryEntity.ts";
import { MotorcycleHistoryNotFoundError } from "../../domain/errors/MotorcycleHistoryNotFoundError.ts";

export interface MotorcycleHistoryRepository {
  save(history: MotorcycleHistoryEntity): Promise<void>;
  findAll(): Promise<MotorcycleHistoryEntity[]>;
  findOneById(id: string): Promise<MotorcycleHistoryEntity | MotorcycleHistoryNotFoundError>;
  delete(id: string): Promise<void>;
  findByMotorcycleId(id: string): Promise<MotorcycleHistoryEntity[]>
  findLastByMotorcycleId(id: string): Promise<MotorcycleHistoryEntity | MotorcycleHistoryNotFoundError>
}
