import { InvalidDateError } from "../../../domain/errors/InvalidDateError.ts";
import { AddRentalCommand } from "../../../domain/types/RentalType.ts";
import { RentalRepository } from "../../repositories/RentalRepository.ts";
import { ClientRepository } from "../../repositories/ClientRepository.ts";
import { MotorcycleRepository } from "../../repositories/MotorcycleRepository.ts";
import { RentalEntity } from "../../../domain/entities/RentalEntity.ts";
import { ClientNotFoundError } from "../../../domain/errors/ClientNotFoundError.ts";
import { MotorcycleNotFoundError } from "../../../domain/errors/MotorcycleNotFoundError.ts";

export class AddRentalUsecase {
  public constructor(
    private readonly rentalRepository: RentalRepository,
    private readonly clientRepository: ClientRepository,
    private readonly motorcycleRepository: MotorcycleRepository
  ) {}

  public async execute(command: AddRentalCommand): Promise<RentalEntity | Error> {
    const client = await this.clientRepository.findOneById(command.clientId);

    if (client instanceof ClientNotFoundError) {
      return client;
    }

    const motorcycle = await this.motorcycleRepository.findOneById(command.motorcycleId);

    if (motorcycle instanceof MotorcycleNotFoundError) {
      return motorcycle;
    }

    if (!(command.startDate instanceof Date) || isNaN(command.startDate.getTime())) {
        throw new InvalidDateError("La date est invalide.");
    }

    if (!(command.endDate instanceof Date) || isNaN(command.startDate.getTime())) {
        throw new InvalidDateError("La date est invalide.");
    }

    const rental = RentalEntity.create({
      client,
      motorcycle,
      startDate: command.startDate,
      endDate: command.endDate,
      cost: command.cost,
      isCompleted: command.isCompleted,
    });

    await this.rentalRepository.save(rental);
    return rental;
  }
}
