import { expect } from "jsr:@std/expect";
import { AddWarrantyUsecase } from "../../../../../application/usecases/warranty/AddWarrantyUsecase.ts";
import { WarrantyRepositoryInMemory } from "../../../../adapters/repositories/WarrantyRepositoryInMemory.ts";
import { MotorcycleRepositoryInMemory } from "../../../../adapters/repositories/MotorcycleRepositoryInMemory.ts";
import { MotorcycleNotFoundError } from "../../../../../domain/errors/MotorcycleNotFoundError.ts";
import { EmptyDescriptionError } from "../../../../../domain/errors/EmptyDescriptionError.ts";
import { InvalidDateError } from "../../../../../domain/errors/InvalidDateError.ts";
import { motorcycle } from "../../../../../infrastructure/tests/fixtures/MotorcycleFixtures.ts"

const warrantyRepository = new WarrantyRepositoryInMemory([]);

const startDate = new Date(2019, 1, 1);
const endDate = new Date(2024, 1, 1);
const type = "Extended";
const terms = "Terms and conditions";

if (startDate || endDate instanceof Error) {
  throw new InvalidDateError("Invalid date");
}

const motorcycleRepository = new MotorcycleRepositoryInMemory([
  motorcycle,
]);

Deno.test("Should return an error if the type is empty", async () => {
  const addWarrantyUsecase = new AddWarrantyUsecase(warrantyRepository, motorcycleRepository);
  const result = await addWarrantyUsecase.execute({
    startDate,
    endDate,
    motorcycleId: motorcycle.id,
    type: "",
    terms
  });

  expect(result).toBeInstanceOf(EmptyDescriptionError);
});

Deno.test("Should return an error if the motorcycle does not exist", async () => {
  const addWarrantyUsecase = new AddWarrantyUsecase(warrantyRepository, motorcycleRepository);
  const result = await addWarrantyUsecase.execute({
    startDate,
    endDate,
    motorcycleId: "",
    type,
    terms
  });

  expect(result).toBeInstanceOf(MotorcycleNotFoundError);
});

Deno.test("Should return an error if the terms are null", async () => {
  const addWarrantyUsecase = new AddWarrantyUsecase(warrantyRepository, motorcycleRepository);
  const result = await addWarrantyUsecase.execute({
    startDate,
    endDate,
    motorcycleId: motorcycle.id,
    type,
    terms: ""
  });
  expect(result).toBeInstanceOf(EmptyDescriptionError);
});

Deno.test("Should return an error if the startDate is invalid", async () => {
  const addWarrantyUsecase = new AddWarrantyUsecase(warrantyRepository, motorcycleRepository);
  const badStartDate = new Date(2022, 1, 1);
  const result = await addWarrantyUsecase.execute({
    startDate: badStartDate,
    endDate,
    motorcycleId: motorcycle.id,
    type,
    terms
  });
  expect(result).toBeInstanceOf(InvalidDateError);
});

Deno.test("Should return an error if the endDate is invalid", async () => {
  const addWarrantyUsecase = new AddWarrantyUsecase(warrantyRepository, motorcycleRepository);
  const badEndDate = new Date(2022, 1, 1);
  const result = await addWarrantyUsecase.execute({
    startDate,
    endDate: badEndDate,
    motorcycleId: motorcycle.id,
    type,
    terms
  });
  expect(result).toBeInstanceOf(InvalidDateError);
});

Deno.test("Should succeed when creating a warranty correctly", async () => {
  const addWarrantyUsecase = new AddWarrantyUsecase(warrantyRepository, motorcycleRepository);
  const result = await addWarrantyUsecase.execute({
    startDate,
    endDate,
    motorcycleId: motorcycle.id,
    type,
    terms
  });
  const maintenances = await warrantyRepository.findAll();

  expect(result).not.toBeInstanceOf(Error);

  expect(maintenances.length).toStrictEqual(1);
  expect(maintenances[0].startDate).toStrictEqual(startDate);
  expect(maintenances[0].endDate).toStrictEqual(endDate);
  expect(maintenances[0].motorcycle).toStrictEqual(motorcycle);
  expect(maintenances[0].type).toStrictEqual(type);
  expect(maintenances[0].terms).toStrictEqual(terms);
});
