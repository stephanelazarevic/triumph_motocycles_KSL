import { WarrantyEntity } from "../../domain/entities/WarrantyEntity.ts";
import { WarrantyNotFoundError } from "../../domain/errors/WarrantyNotFoundError";

export interface WarrantyRepository {
  save(maintenance: WarrantyEntity): Promise<void>;
  findAll(): Promise<WarrantyEntity[]>;
  findOneById(id: string): Promise<WarrantyEntity | WarrantyNotFoundError>;
  delete(id: string): Promise<void>;  
}
