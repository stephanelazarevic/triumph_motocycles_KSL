import { IncidentRepository } from "../../repositories/IncidentRepository.ts";
import { IncidentEntity } from "../../../domain/entities/IncidentEntity.ts";
import { IncidentNotFoundError } from "../../../domain/errors/IncidentNotFoundError.ts";

export class UpdateIncidentUsecase {
  constructor(private incidentRepository: IncidentRepository) {}

  public async execute(incidentId: string, updatedIncident: IncidentEntity): Promise<IncidentNotFoundError | void> {
    const incident = await this.incidentRepository.findOneById(incidentId);
    if (incident instanceof Error) {
      return incident;
    }

    incident.description = updatedIncident.description,
    incident.motorcycle = updatedIncident.motorcycle,
    incident.type = updatedIncident.type
    incident.reportDate = updatedIncident.reportDate,
    incident.resolutionDate = updatedIncident.resolutionDate,
    incident.incidentStatus = updatedIncident.incidentStatus

    await this.incidentRepository.save(incident);
  }
}
