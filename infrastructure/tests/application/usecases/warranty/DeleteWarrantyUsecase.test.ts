import { expect } from "jsr:@std/expect";
import { DeleteWarrantyUsecase } from "../../../../../application/usecases/warranty/DeleteWarrantyUsecase.ts";
import { WarrantyRepositoryInMemory } from "../../../../adapters/repositories/WarrantyRepositoryInMemory.ts";
import { InvalidDateError } from "../../../../../domain/errors/InvalidDateError.ts";
import { WarrantyEntity } from "../../../../../domain/entities/WarrantyEntity.ts";
import { WarrantyNotFoundError } from "../../../../../domain/errors/WarrantyNotFoundError.ts";
import { motorcycle } from "../../../../../infrastructure/tests/fixtures/MotorcycleFixtures.ts"

const warrantyRepository = new WarrantyRepositoryInMemory([]);

const startDate = new Date(2010, 1, 1);
const endDate = new Date(2011, 1, 1);
const warrantyType = "Partial";
const terms = "Terms and conditions";

if (startDate || endDate instanceof Error) {
  throw new InvalidDateError("Invalid date");
}

const warranty = WarrantyEntity.create({
  startDate,
  endDate,
  motorcycle,
  warrantyType,
  terms,
});

warrantyRepository.save(warranty);

Deno.test("Should delete a warranty successfully", async () => {
  const deleteWarrantyUsecase = new DeleteWarrantyUsecase(warrantyRepository);

  const warrantiesBefore = await warrantyRepository.findAll();
  expect(warrantiesBefore.length).toStrictEqual(1);

  await deleteWarrantyUsecase.execute(warranty.id);

  const warrantiesAfter = await warrantyRepository.findAll();
  expect(warrantiesAfter.length).toStrictEqual(0);
});

Deno.test("Should return an error if the warranty does not exist", async () => {
  const deleteWarrantyUsecase = new DeleteWarrantyUsecase(warrantyRepository);
  const badId = "badId";

  const result = await deleteWarrantyUsecase.execute(badId);

  expect(result).toBeInstanceOf(WarrantyNotFoundError);
});
