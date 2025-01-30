import { IncidentEntity } from "../../../domain/entities/IncidentEntity.ts";
import { IncidentType } from "../../../domain/enum/IncidentEnum.ts";
import { InvalidDateError } from "../../../domain/errors/InvalidDateError.ts";
import { MotorcycleNotFoundError } from "../../../domain/errors/MotorcycleNotFoundError.ts";
import type { IncidentRepository } from "../../repositories/IncidentRepository.ts";
import type { MotorcycleRepository } from "../../repositories/MotorcycleRepository.ts";

export class CreateIncidentUsecase {
  public constructor(
    private readonly incidentRepository: IncidentRepository,
    private readonly motorcycleRepository: MotorcycleRepository,
  ) {}

  public async execute(
    description: string,
    motorcycleId: string,
    type: IncidentType,
    reportDate: Date,
    resolutionDate: Date,
    status: string,
  ): Promise<IncidentEntity | Error> {
    if (!(reportDate instanceof Date) || isNaN(reportDate.getTime())) {
      throw new InvalidDateError("La date de signalement est invalide.");
    }

    if (!(resolutionDate instanceof Date) || isNaN(resolutionDate.getTime())) {
      throw new InvalidDateError("La date de résolution est invalide.");
    }

    if (resolutionDate < reportDate) {
      throw new InvalidDateError(
        "La date de résolution doit être postérieure à la date de signalement.",
      );
    }

    const motorcycle = await this.motorcycleRepository.findOneById(
      motorcycleId,
    );

    if (motorcycle instanceof MotorcycleNotFoundError) {
      throw motorcycle;
    }

    const incident = IncidentEntity.create(
      description,
      motorcycle,
      type,
      reportDate,
      resolutionDate,
      status,
    );

    await this.incidentRepository.save(incident);
    return incident;
  }
}
