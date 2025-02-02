import { MotorcycleRepository } from "../../repositories/MotorcycleRepository.ts";
import { MotorcycleEntity } from "../../../domain/entities/MotorcycleEntity.ts";
import { MotorcycleNotFoundError } from "../../../domain/errors/MotorcycleNotFoundError.ts";

export class UpdateMotorcycleUsecase {
  constructor(private motorcycleRepository: MotorcycleRepository) {}

  public async execute(motorcycleId: string, updatedMotorcycle: MotorcycleEntity): Promise<MotorcycleNotFoundError | void> {
    const motorcycle = await this.motorcycleRepository.findOneById(motorcycleId);
    if (motorcycle instanceof Error) {
      return motorcycle;
    }

    motorcycle.dealerIdentifier = updatedMotorcycle.dealerIdentifier
    motorcycle.brand = updatedMotorcycle.brand
    motorcycle.model = updatedMotorcycle.model
    motorcycle.year = updatedMotorcycle.year
    motorcycle.registrationNumber = updatedMotorcycle.registrationNumber
    motorcycle.motorcycleStatus = updatedMotorcycle.motorcycleStatus
    motorcycle.clientIdentifier = updatedMotorcycle.clientIdentifier
    motorcycle.driverIdentifier = updatedMotorcycle.driverIdentifier

    await this.motorcycleRepository.save(motorcycle);
  }
}
