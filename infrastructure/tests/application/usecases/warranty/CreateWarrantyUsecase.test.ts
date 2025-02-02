import { expect } from "jsr:@std/expect";
import { CreateWarrantyUsecase } from "../../../../../application/usecases/warranty/CreateWarrantyUsecase.ts";
import { WarrantyRepositoryInMemory } from "../../../../adapters/repositories/WarrantyRepositoryInMemory.ts";
import { MotorcycleRepositoryInMemory } from "../../../../adapters/repositories/MotorcycleRepositoryInMemory.ts";
import { MotorcycleEntity } from "../../../../../domain/entities/MotorcycleEntity.ts";
import { Brand } from "../../../../../domain/value-objects/Brand.ts";
import { Model } from "../../../../../domain/value-objects/Model.ts";
import { MotorcycleNotFoundError } from "../../../../../domain/errors/MotorcycleNotFoundError.ts";
import { EmptyDescriptionError } from "../../../../../domain/errors/EmptyDescriptionError.ts";
import { InvalidDateError } from "../../../../../domain/errors/InvalidDateError.ts";

const warrantyRepository = new WarrantyRepositoryInMemory([]);
const brand = Brand.from("Triumph");
const model = Model.from("Street Triple");

if (brand instanceof Error) {
  throw new Error("Failed to initialize a new brand");
}

if (model instanceof Error) {
  throw new Error("Failed to initialize a new model");
}

const motorcycle = MotorcycleEntity.create(brand, model, 2024);
const startDate = new Date(2019, 1, 1);
const endDate = new Date(2024, 1, 1);
const warrantyType = "Extended";
const terms = "Terms and conditions";

if (startDate || endDate instanceof Error) {
  throw new InvalidDateError("Invalid date");
}

const motorcycleRepository = new MotorcycleRepositoryInMemory([
  motorcycle,
]);

Deno.test("Should return an error if the warrantyType is empty", async () => {
  const createWarrantyUsecase = new CreateWarrantyUsecase(warrantyRepository, motorcycleRepository);
  const result = await createWarrantyUsecase.execute(startDate, endDate, motorcycle.id, "", terms);

  expect(result).toBeInstanceOf(EmptyDescriptionError);
});

Deno.test("Should return an error if the motorcycle does not exist", async () => {
  const createWarrantyUsecase = new CreateWarrantyUsecase(warrantyRepository, motorcycleRepository);
  const result = await createWarrantyUsecase.execute(startDate, endDate, "", warrantyType, terms);

  expect(result).toBeInstanceOf(MotorcycleNotFoundError);
});

Deno.test("Should return an error if the terms are null", async () => {
  const createWarrantyUsecase = new CreateWarrantyUsecase(warrantyRepository, motorcycleRepository);
  const result = await createWarrantyUsecase.execute(startDate, endDate, motorcycle.id, warrantyType, "");

  expect(result).toBeInstanceOf(EmptyDescriptionError);
});

Deno.test("Should return an error if the startDate is invalid", async () => {
  const createWarrantyUsecase = new CreateWarrantyUsecase(warrantyRepository, motorcycleRepository);
  const badStartDate = new Date(2022, 1, 1);
  const result = await createWarrantyUsecase.execute(badStartDate, endDate, motorcycle.id, warrantyType, terms);

  expect(result).toBeInstanceOf(InvalidDateError);
});

Deno.test("Should return an error if the endDate is invalid", async () => {
  const createWarrantyUsecase = new CreateWarrantyUsecase(warrantyRepository, motorcycleRepository);
  const badEndDate = new Date(2022, 1, 1);
  const result = await createWarrantyUsecase.execute(startDate, badEndDate, motorcycle.id, warrantyType, terms);

  expect(result).toBeInstanceOf(InvalidDateError);
});

Deno.test("Should succeed when creating a warranty correctly", async () => {
  const createWarrantyUsecase = new CreateWarrantyUsecase(warrantyRepository, motorcycleRepository);
  const result = await createWarrantyUsecase.execute(startDate, endDate, motorcycle.id, warrantyType, terms);

  const maintenances = await warrantyRepository.findAll();

  expect(result).not.toBeInstanceOf(Error);

  expect(maintenances.length).toStrictEqual(1);
  expect(maintenances[0].startDate).toStrictEqual(startDate);
  expect(maintenances[0].endDate).toStrictEqual(endDate);
  expect(maintenances[0].motorcycle).toStrictEqual(motorcycle);
  expect(maintenances[0].warrantyType).toStrictEqual(warrantyType);
  expect(maintenances[0].terms).toStrictEqual(terms);
});
