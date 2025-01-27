import { BreakdownEntity } from "../../../domain/entities/BreakdownEntity.ts";
import { BreakdownType } from "../../../domain/enum/BreakdownEnum.ts";
import { InvalidDateError } from "../../../domain/errors/InvalidDateError.ts";
import { MotorcycleNotFoundError } from "../../../domain/errors/MotorcycleNotFoundError.ts";
import type { BreakdownRepository } from "../../repositories/BreakdownRepository.ts";
import type { MotorcycleRepository } from "../../repositories/MotorcycleRepository.ts";

export class CreateBreakdownUsecase {
  public constructor(
    private readonly breakdownRepository: BreakdownRepository,
    private readonly motorcycleRepository: MotorcycleRepository,
  ) {}

  public async execute(description: string, motorcycleId: string, type: BreakdownType, reportDate: Date, resolutionDate: Date, status: string) {

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

    if (!motorcycle) {
      return new MotorcycleNotFoundError();
    }

    const breakdown = BreakdownEntity.create(
      description,
      motorcycle,
      type,
      reportDate,
      resolutionDate,
      status
    );

    await this.breakdownRepository.save(breakdown);
  }
}
