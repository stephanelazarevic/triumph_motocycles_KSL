import { TestRideEntity } from "../../domain/entities/TestRideEntity.ts";
import { TestRideNotFoundError } from "../../domain/errors/TestRideNotFoundError.ts";
import { EntityRepositoryInterface } from "./EntityRepositoryInterface.ts";

export interface TestRideRepository extends EntityRepositoryInterface<TestRideEntity> {
  save(testRide: TestRideEntity): Promise<void>;
  findAll(): Promise<TestRideEntity[]>;
  findOneById(id: string): Promise<TestRideEntity | TestRideNotFoundError>;
  delete(id: string): Promise<void>;
}
