import { expect } from "jsr:@std/expect";
import { DeleteWarrantyUsecase } from "../../../../../application/usecases/warranty/DeleteWarrantyUsecase.ts";
import { WarrantyRepositoryInMemory } from "../../../../adapters/repositories/WarrantyRepositoryInMemory.ts";
import { MotorcycleEntity } from "../../../../../domain/entities/MotorcycleEntity.ts";
import { Brand } from "../../../../../domain/types/Brand.ts";
import { Model } from "../../../../../domain/types/Model.ts";
import { InvalidDateError } from "../../../../../domain/errors/InvalidDateError.ts";
import { WarrantyEntity } from "../../../../../domain/entities/WarrantyEntity.ts";
import { WarrantyNotFoundError } from "../../../../../domain/errors/WarrantyNotFoundError.ts";

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
const startDate = new Date(2010, 1, 1);
const endDate = new Date(2011, 1, 1);
const warrantyType = "Partial";
const terms = "Terms and conditions";

if (startDate || endDate instanceof Error) {
  throw new InvalidDateError("Invalid date");
}

const warranty = WarrantyEntity.create(
  startDate,
  endDate,
  motorcycle,
  warrantyType,
  terms,
);

warrantyRepository.save(warranty);

Deno.test("Should delete a warranty successfully", async () => {
  const deleteWarrantyUsecase = new DeleteWarrantyUsecase(warrantyRepository);

  const warrantiesBefore = await warrantyRepository.findAll();
  expect(warrantiesBefore.length).toStrictEqual(1);

  await deleteWarrantyUsecase.execute(warranty.identifier);

  const warrantiesAfter = await warrantyRepository.findAll();
  expect(warrantiesAfter.length).toStrictEqual(0);
});

Deno.test("Should return an error if the warranty does not exist", async () => {
  const deleteWarrantyUsecase = new DeleteWarrantyUsecase(warrantyRepository);
  const badId = "badId";

  const result = await deleteWarrantyUsecase.execute(badId);

  expect(result).toBeInstanceOf(WarrantyNotFoundError);
});
