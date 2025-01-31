import { IncidentEntity } from "../../../domain/entities/IncidentEntity.ts";
import { IncidentNotFoundError } from "../../../domain/errors/IncidentNotFoundError.ts";
import { IncidentRepository } from "../../repositories/IncidentRepository.ts";

export class FindIncidentUsecase {
  constructor(private incidentRepository: IncidentRepository) {}

  public async execute(id: string): Promise<IncidentEntity | IncidentNotFoundError> {
    const existing = await this.incidentRepository.findOneById(id);
    if (!existing) {
      return new IncidentNotFoundError();
    }
    return existing;
  }
}
