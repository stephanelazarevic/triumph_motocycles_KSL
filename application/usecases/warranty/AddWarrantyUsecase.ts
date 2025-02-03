import { WarrantyEntity } from "../../../domain/entities/WarrantyEntity.ts";
import { MotorcycleNotFoundError } from "../../../domain/errors/MotorcycleNotFoundError.ts";
import type { MotorcycleRepository } from "../../repositories/MotorcycleRepository.ts";
import { WarrantyRepository } from "../../repositories/WarrantyRepository.ts";
import { AddWarrantyCommand } from "../../../domain/types/WarrantyType.ts";
import { WarrantyInvalidStartDateError } from "../../../domain/errors/WarrantyInvalidStartDateError.ts";
import { WarrantyInvalidEndDateError } from "../../../domain/errors/WarrantyInvalidEndDateError.ts";
import { WarrantyEndDateIsBeforeStartDateError } from "../../../domain/errors/WarrantyEndDateIsBeforeStartDateError.ts";

export class AddWarrantyUsecase {
  public constructor(
    private readonly warrantyRepository: WarrantyRepository,
    private readonly motorcycleRepository: MotorcycleRepository,
  ) {}

  public async execute(command: AddWarrantyCommand): Promise<WarrantyEntity | Error> {
    if (!(command.startDate instanceof Date) || isNaN(command.startDate.getTime())) {
      return new WarrantyInvalidStartDateError();
    }

    if (!(command.endDate instanceof Date) || isNaN(command.endDate.getTime())) {
      return new WarrantyInvalidEndDateError();
    }

    if (command.endDate < command.startDate) {
      return new WarrantyEndDateIsBeforeStartDateError()
    }

    const motorcycle = await this.motorcycleRepository.findOneById(
      command.motorcycleId,
    );

    if (motorcycle instanceof MotorcycleNotFoundError) {
      throw motorcycle;
    }

    const warranty = WarrantyEntity.create( {
      startDate: command.startDate,
      endDate: command.endDate,
      motorcycle,
      type: command.type,
      terms: command.terms
    });

    await this.warrantyRepository.save(warranty);
    return warranty;
  }
}
