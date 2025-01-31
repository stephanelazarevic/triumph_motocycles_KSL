import { IncidentRepository } from "../../repositories/IncidentRepository.ts";
import { IncidentEntity } from "../../../domain/entities/IncidentEntity.ts";
import { IncidentNotFoundError } from "../../../domain/errors/IncidentNotFoundError.ts";

export class UpdateIncidentUsecase {
  constructor(private incidentRepository: IncidentRepository) {}

  public async execute(incident: IncidentEntity): Promise<IncidentNotFoundError | void> {
    const existing = await this.incidentRepository.findOneById(incident.identifier);
    if (!existing) {
      return new IncidentNotFoundError();
    }
    await this.incidentRepository.save(incident);
  }
}
