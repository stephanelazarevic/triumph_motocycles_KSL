import { TestRideEntity } from "../../../domain/entities/TestRideEntity.ts";
import type { TestRideRepository } from "../../repositories/TestRideRepository.ts";

export class ListTestRidesUsecase {
  public constructor(
    private readonly testRideRepository: TestRideRepository,
  ) {}

  public async execute(): Promise<TestRideEntity[]> {
    return await this.testRideRepository.findAll();
  }
}
