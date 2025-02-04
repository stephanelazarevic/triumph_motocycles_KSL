import { TestRideRepository } from "../../repositories/TestRideRepository.ts";
import { ClientRepository } from "../../repositories/ClientRepository.ts";
import { updateTestRideCommand } from "../../../domain/types/TestRide.ts";
import { MotorcycleRepository } from "../../repositories/MotorcycleRepository.ts";
import { TestRideEntity } from "../../../domain/entities/TestRideEntity.ts";

export class UpdateTestRideUsecase {
  constructor(
    private testRideRepository: TestRideRepository,
    private clientRepository: ClientRepository,
    private motorcycleRepository: MotorcycleRepository
  ) {}

  public async execute(testRideId: string, command: updateTestRideCommand): Promise<TestRideEntity | Error> {
    const testRide = await this.testRideRepository.findOneById(testRideId);
    if (testRide instanceof Error) {
      return testRide;
    }

    if (command.clientId) {
        const client = await this.clientRepository.findOneById(command.clientId);
        if (client instanceof Error) {
          return client;
        }
        testRide.client = client;
      }

    if (command.motorcycleId) {
      const motorcycle = await this.motorcycleRepository.findOneById(command.motorcycleId);
      if (motorcycle instanceof Error) {
        return motorcycle;
      }
      testRide.motorcycle = motorcycle;
    }

    if (command.date) {
      testRide.date = command.date;
    }
    if (command.feedback) {
      testRide.feedback = command.feedback;
    }
    if (command.isCompleted) {
      testRide.isCompleted = command.isCompleted;
    }

    testRide.markAsUpdated();
    await this.testRideRepository.save(testRide);

    return testRide;
  }
}
