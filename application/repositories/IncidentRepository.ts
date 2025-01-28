import { IncidentEntity } from "../../domain/entities/IncidentEntity.ts";
import { IncidentNotFoundError } from "../../domain/errors/IncidentNotFoundError.ts";

export interface IncidentRepository {
  save(maintenance: IncidentEntity): Promise<void>;
  findAll(): Promise<IncidentEntity[]>;
  findOneById(id: string): Promise<IncidentEntity | IncidentNotFoundError>;
  delete(id: string): Promise<void>;  
}
