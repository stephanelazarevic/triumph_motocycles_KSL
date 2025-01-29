import { WarrantyEntity } from "../../domain/entities/WarrantyEntity.ts";
import { WarrantyNotFoundError } from "../../domain/errors/WarrantyNotFoundError.ts";
import { EntityRepositoryInterface } from "./EntityRepositoryInterface.ts";

export interface WarrantyRepository extends EntityRepositoryInterface<WarrantyEntity>{
  save(maintenance: WarrantyEntity): Promise<void>;
  findAll(): Promise<WarrantyEntity[]>;
  findOneById(id: string): Promise<WarrantyEntity | WarrantyNotFoundError>;
  delete(id: string): Promise<void>;
}
