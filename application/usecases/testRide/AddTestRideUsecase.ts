import { InvalidDateError } from "../../../domain/errors/InvalidDateError.ts";
import { MotorcycleNotFoundError } from "../../../domain/errors/MotorcycleNotFoundError.ts";
import { AddTestRideCommand } from "../../../domain/types/TestRide.ts";
import type { TestRideRepository } from "../../repositories/TestRideRepository.ts";
import type { ClientRepository } from "../../repositories/ClientRepository.ts";
import type { MotorcycleRepository } from "../../repositories/MotorcycleRepository.ts";
import { TestRideEntity } from "../../../domain/entities/TestRideEntity.ts";
import { ClientNotFoundError } from "../../../domain/errors/ClientNotFoundError.ts";

export class AddTestRideUsecase {
  public constructor(
    private readonly testRideRepository: TestRideRepository,
    private readonly clientRepository: ClientRepository,
    private readonly motorcycleRepository: MotorcycleRepository,
  ) {}

  public async execute(command: AddTestRideCommand): Promise<TestRideEntity | Error> {
    if (!(command.date instanceof Date) || isNaN(command.date.getTime())) {
      throw new InvalidDateError("La date est invalide.");
    }

    const client = await this.clientRepository.findOneById(
        command.clientId,
    );

    if (client instanceof ClientNotFoundError) {
        return client;
      }

    const motorcycle = await this.motorcycleRepository.findOneById(
      command.motorcycleId,
    );

    if (motorcycle instanceof MotorcycleNotFoundError) {
      return motorcycle;
    }

    const testRide = TestRideEntity.create({
      client,
      motorcycle,
      date: command.date,
      feedback: command.feedback,
      isCompleted: command.isCompleted,
    });

    await this.testRideRepository.save(testRide);
    return testRide;
  }
}
