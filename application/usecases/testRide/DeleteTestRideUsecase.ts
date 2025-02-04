import { TestRideRepository } from "../../repositories/TestRideRepository.ts";
import { TestRideNotFoundError } from "../../../domain/errors/TestRideNotFoundError.ts";

export class DeleteTestRideUsecase {
  constructor(private testRideRepository: TestRideRepository) {}

  public async execute(id: string): Promise<TestRideNotFoundError | void> {
    const existingTestRide = await this.testRideRepository.findOneById(id);
    if (!existingTestRide) {
      return new TestRideNotFoundError();
    }

    await this.testRideRepository.delete(id);
  }
}
