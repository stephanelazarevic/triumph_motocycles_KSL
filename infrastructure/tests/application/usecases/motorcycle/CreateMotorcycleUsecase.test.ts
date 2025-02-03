import { expect } from "jsr:@std/expect";
import { CreateMotorcycleUsecase } from "../../../../../application/usecases/motorcycle/CreateMotorcycleUsecase.ts";
import { MotorcycleRepositoryInMemory } from "../../../../adapters/repositories/MotorcycleRepositoryInMemory.ts";
import { motorcycle } from "../../../../../infrastructure/tests/fixtures/MotorcycleFixtures.ts"
import { BrandLengthTooShortError } from "../../../../../domain/errors/BrandLengthTooShortError.ts";

const motorcycleRepository = new MotorcycleRepositoryInMemory([]);

Deno.test("Should return an error if the brand is invalid", async () => {
  const createMotorcycleUsecase = new CreateMotorcycleUsecase(
    motorcycleRepository,
  );
  const result = await createMotorcycleUsecase.execute(
    motorcycle.dealerId,
    "U",
    "Street Triple",
    motorcycle.year,
    motorcycle.registrationNumber,
    motorcycle.status,
    motorcycle.clientId
  );

  expect(result).toBeInstanceOf(BrandLengthTooShortError);
});

