import { Enterprise } from "../../domain/entities/Enterprise.ts";
import { EnterpriseNotFoundError } from "../../domain/errors/EnterpriseNotFoundError.ts";

export interface EnterpriseRepository {
  save(enterprise: Enterprise): Promise<void>;
  findAll(): Promise<Enterprise[]>;
  findOneById(id: string): Promise<Enterprise | EnterpriseNotFoundError>;
  delete(id: string): Promise<void>;
}
