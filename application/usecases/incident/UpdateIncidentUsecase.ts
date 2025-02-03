import { IncidentRepository } from "../../repositories/IncidentRepository.ts";
import { updateIncidentCommand } from "../../../domain/types/IncidentType.ts";
import { MotorcycleRepository } from "../../repositories/MotorcycleRepository.ts";
import { IncidentEntity } from "../../../domain/entities/IncidentEntity.ts";

export class UpdateIncidentUsecase {
  constructor(
    private incidentRepository: IncidentRepository,
    private motorcycleRepository: MotorcycleRepository
  ) {}

  public async execute(incidentId: string, command: updateIncidentCommand): Promise<IncidentEntity | Error> {
    const incident = await this.incidentRepository.findOneById(incidentId);
    if (incident instanceof Error) {
      return incident;
    }

    if (command.motorcycleId) {
      const motorcycle = await this.motorcycleRepository.findOneById(command.motorcycleId);
      if (motorcycle instanceof Error) {
        return motorcycle;
      }
      incident.motorcycle = motorcycle;
    }

    if (command.description) {
      incident.description = command.description;
    }
    if (command.type) {
      incident.type = command.type;
    }
    if (command.reportDate) {
      incident.reportDate = command.reportDate;
    }
    if (command.resolutionDate) {
      incident.resolutionDate = command.resolutionDate;
    }
    if (command.status) {
      incident.status = command.status;
    }

    incident.markAsUpdated();
    await this.incidentRepository.save(incident);

    return incident;
  }
}
