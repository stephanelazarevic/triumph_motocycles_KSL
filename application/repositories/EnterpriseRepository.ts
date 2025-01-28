import { EnterpriseEntity } from "../../domain/entities/EnterpriseEntity.ts";

export interface EnterpriseRepository {
  save(enterprise: EnterpriseEntity): Promise<void>;
  findAll(): Promise<EnterpriseEntity[]>;
  findById(id: string): Promise<EnterpriseEntity>;
  delete(id: string): Promise<void>;
}
