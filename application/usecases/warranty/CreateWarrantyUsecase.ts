import { WarrantyEntity } from "../../../domain/entities/WarrantyEntity.ts";
import { MotorcycleNotFoundError } from "../../../domain/errors/MotorcycleNotFoundError.ts";
import { InvalidDateError } from "../../../domain/errors/InvalidDateError.ts";
import type { MotorcycleRepository } from "../../repositories/MotorcycleRepository.ts";
import { WarrantyRepository } from "../../repositories/WarrantyRepository.ts";

export class CreateWarrantyUsecase {
  public constructor(
    private readonly warrantyRepository: WarrantyRepository,
    private readonly motorcycleRepository: MotorcycleRepository,
  ) {}

  public async execute(
    startDate: Date,
    endDate: Date,
    motorcycleId: string,
    warrantyType: string,
    terms: string,
  ) {
    if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
      throw new InvalidDateError("La date de départ est invalide.");
    }

    if (!(endDate instanceof Date) || isNaN(endDate.getTime())) {
      throw new InvalidDateError("La date de fin est invalide.");
    }

    if (endDate < startDate) {
      throw new InvalidDateError(
        "La date de fin doit être postérieure à la date de départ.",
      );
    }

    const motorcycle = await this.motorcycleRepository.findOneById(
      motorcycleId,
    );

    if (!motorcycle) {
      return new MotorcycleNotFoundError();
    }

    const warranty = WarrantyEntity.create(
      startDate,
      endDate,
      motorcycle,
      warrantyType,
      terms,
    );

    await this.warrantyRepository.save(warranty);
  }
}
