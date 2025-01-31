import { IncidentEntity } from "../../domain/entities/IncidentEntity.ts";
import { IncidentNotFoundError } from "../../domain/errors/IncidentNotFoundError.ts";
import { EntityRepositoryInterface } from "./EntityRepositoryInterface.ts";

export interface IncidentRepository extends EntityRepositoryInterface<IncidentEntity> {
  save(maintenance: IncidentEntity): Promise<void>;
  findAll(): Promise<IncidentEntity[]>;
  findOneById(id: string): Promise<IncidentEntity | IncidentNotFoundError>;
  delete(id: string): Promise<void>;
}
