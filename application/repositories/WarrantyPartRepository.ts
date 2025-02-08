import { WarrantyPartEntity } from "../../domain/entities/WarrantyPartEntity.ts";
import { WarrantyPartNotFoundError } from "../../domain/errors/WarrantyPartNotFoundError.ts";
import { EntityRepositoryInterface } from "./EntityRepositoryInterface.ts";

export interface WarrantyPartRepository extends EntityRepositoryInterface<WarrantyPartEntity> {
  save(warrantyPart: WarrantyPartEntity): Promise<void>;
  findAll(): Promise<WarrantyPartEntity[]>;
  findOneById(id: string): Promise<WarrantyPartEntity | WarrantyPartNotFoundError>;
  delete(id: string): Promise<void>;
}
