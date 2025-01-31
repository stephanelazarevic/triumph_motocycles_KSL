import { EnterpriseEntity } from "../../domain/entities/EnterpriseEntity.ts";
import { EnterpriseNotFoundError } from "../../domain/errors/EnterpriseNotFoundError.ts";

export interface EnterpriseRepository {
  save(enterprise: EnterpriseEntity): Promise<void>;
  findAll(): Promise<EnterpriseEntity[]>;
  findOneById(id: string): Promise<EnterpriseEntity | EnterpriseNotFoundError>;
  delete(id: string): Promise<void>;
}
