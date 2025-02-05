import { EntityRepositoryInterface } from "./EntityRepositoryInterface.ts";
import { PartNotFoundError } from "../../domain/errors/PartNotFoundError.ts";
import { PartEntity } from "../../domain/entities/PartEntity.ts";

export interface PartRepository extends EntityRepositoryInterface<PartEntity> {
  save(part: PartEntity): Promise<void>;
  findAll(): Promise<PartEntity[]>;
  findOneById(id: string): Promise<PartEntity | PartNotFoundError>;
  delete(id: string): Promise<void>;
}
