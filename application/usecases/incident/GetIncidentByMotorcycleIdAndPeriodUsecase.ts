import { IncidentRepository } from "../../repositories/IncidentRepository";

export class GetIncidentByMotorcycleIdAndPeriodUsecase {
    constructor(
      private incidentRepository: IncidentRepository,
    ) {}
  
    async execute(motorcycleId: string, startDate: Date, endDate: Date | null) {
      const incidents = await this.incidentRepository.findByMotorcycleIdAndPeriod(motorcycleId, startDate, endDate);
      if (incidents instanceof Error) {
        throw incidents;
      }
      return incidents;
  }
}