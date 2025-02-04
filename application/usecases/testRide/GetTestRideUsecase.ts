import { TestRideEntity } from "../../../domain/entities/TestRideEntity.ts";
import { TestRideNotFoundError } from "../../../domain/errors/TestRideNotFoundError.ts";
import { TestRideRepository } from "../../repositories/TestRideRepository.ts";

export class GetTestRideUsecase {
  constructor(private testRideRepository: TestRideRepository) {}

  public async execute(id: string): Promise<TestRideEntity | TestRideNotFoundError> {
    const existingTestRide = await this.testRideRepository.findOneById(id);
    if (!existingTestRide) {
      return new TestRideNotFoundError();
    }
    return existingTestRide;
  }
}
