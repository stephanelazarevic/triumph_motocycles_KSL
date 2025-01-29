import type { MotorcycleEntity } from "../../domain/entities/MotorcycleEntity.ts";
import { EntityRepositoryInterface } from "./EntityRepositoryInterface.ts";
import { MotorcycleNotFoundError } from "../../domain/errors/MotorcycleNotFoundError.ts";

export interface MotorcycleRepository extends EntityRepositoryInterface<MotorcycleEntity> {
  save(motorcycle: MotorcycleEntity): Promise<void>;
  findAll(): Promise<MotorcycleEntity[]>;
  findOneById(id: string): Promise<MotorcycleEntity | MotorcycleNotFoundError>;
}
