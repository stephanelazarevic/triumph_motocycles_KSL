import { MotorcyclePartEntity } from "../../domain/entities/MotorcyclePartEntity.ts";
import { MotorcyclePartNotFoundError } from "../../domain/errors/MotorcyclePartNotFoundError.ts";
import { EntityRepositoryInterface } from "./EntityRepositoryInterface.ts";

export interface MotorcyclePartRepository extends EntityRepositoryInterface<MotorcyclePartEntity> {
  save(motoPart: MotorcyclePartEntity): Promise<void>;
  findAll(): Promise<MotorcyclePartEntity[]>;
  findOneById(id: string): Promise<MotorcyclePartEntity | MotorcyclePartNotFoundError>;
  delete(id: string): Promise<void>;
}
