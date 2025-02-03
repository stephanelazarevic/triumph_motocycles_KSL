import { DriverEntity } from "../../domain/entities/DriverEntity.ts";
import { DriverNotFoundError } from "../../domain/errors/DriverNotFoundError.ts";
import { EntityRepositoryInterface } from "./EntityRepositoryInterface.ts";

export interface DriverRepository extends EntityRepositoryInterface<DriverEntity> {
  save(driver: DriverEntity): Promise<void>;
  findAll(): Promise<DriverEntity[]>;
  findOneById(id: string): Promise<DriverEntity | DriverNotFoundError>;
  delete(id: string): Promise<void>;
}
