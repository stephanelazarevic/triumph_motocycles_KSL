import { TestRideRepository } from "../../../application/repositories/TestRideRepository.ts";
import { TestRideEntity } from "../../../domain/entities/TestRideEntity.ts";
import { TestRideNotFoundError } from "../../../domain/errors/TestRideNotFoundError.ts";

export class TestRideRepositoryInMemory implements TestRideRepository {
  public constructor(private testRides: TestRideEntity[]) {}

  public save(testRide: TestRideEntity): Promise<void> {
    const index = this.testRides.findIndex((testRide) => testRide.id === testRide.id);
    if (index === -1) {
      this.testRides.push(testRide);
    } else {
      this.testRides[index] = testRide;
    }
    return Promise.resolve();
  }

  public findAll(): Promise<TestRideEntity[]> {
    return Promise.resolve(this.testRides);
  }

  findOneById(id: string): Promise<TestRideEntity | TestRideNotFoundError> {
    const foundTestRide = this.testRides.find((testRide) => {
      return testRide.id === id;
    });

    return Promise.resolve(foundTestRide ?? new TestRideNotFoundError());
  }

  delete(id: string): Promise<void> {
    this.testRides = this.testRides.filter((testRide) => testRide.id !== id);
    return Promise.resolve();
  }
}
