import { IncidentEntity } from "../../../domain/entities/IncidentEntity.ts";
import { InvalidDateError } from "../../../domain/errors/InvalidDateError.ts";
import { MotorcycleNotFoundError } from "../../../domain/errors/MotorcycleNotFoundError.ts";
import { AddIncidentCommand } from "../../../domain/types/IncidentType.ts";
import type { IncidentRepository } from "../../repositories/IncidentRepository.ts";
import type { MotorcycleRepository } from "../../repositories/MotorcycleRepository.ts";

export class AddIncidentUsecase {
  public constructor(
    private readonly incidentRepository: IncidentRepository,
    private readonly motorcycleRepository: MotorcycleRepository,
  ) {}

  public async execute(command: AddIncidentCommand): Promise<IncidentEntity | Error> {
    if (!(command.reportDate instanceof Date) || isNaN(command.reportDate.getTime())) {
      throw new InvalidDateError("La date de signalement est invalide.");
    }

    if (!(command.resolutionDate instanceof Date) || isNaN(command.resolutionDate.getTime())) {
      throw new InvalidDateError("La date de résolution est invalide.");
    }

    if (command.resolutionDate < command.reportDate) {
      throw new InvalidDateError(
        "La date de résolution doit être postérieure à la date de signalement.",
      );
    }

    const motorcycle = await this.motorcycleRepository.findOneById(
      command.motorcycleId,
    );

    if (motorcycle instanceof MotorcycleNotFoundError) {
      throw motorcycle;
    }

    const incident = IncidentEntity.create({
      description: command.description,
      motorcycle,
      type: command.type,
      reportDate: command.reportDate,
      resolutionDate: command.resolutionDate,
      status: command.status,
    });

    await this.incidentRepository.save(incident);
    return incident;
  }
}
