import { expect } from "jsr:@std/expect";
import { AddMotorcycleUsecase } from "../../../../../application/usecases/motorcycle/AddMotorcycleUsecase.ts";
import { MotorcycleRepositoryInMemory } from "../../../../adapters/repositories/MotorcycleRepositoryInMemory.ts";
import { motorcycle } from "../../../../../infrastructure/tests/fixtures/MotorcycleFixtures.ts"
import { BrandLengthTooShortError } from "../../../../../domain/errors/BrandLengthTooShortError.ts";

const motorcycleRepository = new MotorcycleRepositoryInMemory([]);

Deno.test("Should return an error if the brand is invalid", async () => {
  const addMotorcycleUsecase = new AddMotorcycleUsecase(
    motorcycleRepository,
  );
  const result = await addMotorcycleUsecase.execute({
    dealerId: motorcycle.dealerId,
    brand: "U",
    model: "Street Triple",
    year: motorcycle.year,
    registrationNumber: motorcycle.registrationNumber,
    status: motorcycle.status,
    clientId: motorcycle.clientId
  });

  expect(result).toBeInstanceOf(BrandLengthTooShortError);
});

