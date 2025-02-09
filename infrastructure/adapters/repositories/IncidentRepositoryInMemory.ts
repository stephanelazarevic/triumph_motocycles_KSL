import { IncidentRepository } from "../../../application/repositories/IncidentRepository.ts";
import { IncidentEntity } from "../../../domain/entities/IncidentEntity.ts";
import { IncidentNotFoundError } from "../../../domain/errors/IncidentNotFoundError.ts";

export class IncidentRepositoryInMemory implements IncidentRepository {
  public constructor(private incidents: IncidentEntity[]) {}

  public save(incident: IncidentEntity): Promise<void> {
    const index = this.incidents.findIndex((incident) => incident.id === incident.id);
    if (index === -1) {
      this.incidents.push(incident);
    } else {
      this.incidents[index] = incident;
    }
    return Promise.resolve();
  }

  public findAll(): Promise<IncidentEntity[]> {
    return Promise.resolve(this.incidents);
  }

  findOneById(id: string): Promise<IncidentEntity | IncidentNotFoundError> {
    const foundIncident = this.incidents.find((incident) => {
      return incident.id === id;
    });

    return Promise.resolve(foundIncident ?? new IncidentNotFoundError());
  }

  delete(id: string): Promise<void> {
    this.incidents = this.incidents.filter((incident) => incident.id !== id);
    return Promise.resolve();
  }

  findByMotorcycleIdAndPeriod(motorcycleId: string, startDate: Date, endDate: Date | null): Promise<IncidentEntity[]> {
    const foundIncidents = this.incidents.filter((incident) => {
      return incident.motorcycle.id === motorcycleId &&
        incident.reportDate >= startDate &&
        (!endDate || incident.reportDate <= endDate);
    });

    return Promise.resolve(foundIncidents);
  }
}
