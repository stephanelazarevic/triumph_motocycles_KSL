import { expect } from "jsr:@std/expect";
import { UpdateWarrantyUsecase } from "../../../../../application/usecases/warranty/UpdateWarrantyUsecase.ts";
import { WarrantyRepositoryInMemory } from "../../../../adapters/repositories/WarrantyRepositoryInMemory.ts";
import { WarrantyEntity } from "../../../../../domain/entities/WarrantyEntity.ts";
import { WarrantyNotFoundError } from "../../../../../domain/errors/WarrantyNotFoundError.ts";
import { motorcycle } from "../../../../../infrastructure/tests/fixtures/MotorcycleFixtures.ts"

Deno.test("Should update a warranty successfully when it exists", async () => {

  const existingWarranty = WarrantyEntity.create(
    new Date(2010, 1, 1),
    new Date(2011, 1, 1),
    motorcycle,
    "Partial warranty",
    "Terms and conditions",
  );

  const warrantyRepository = new WarrantyRepositoryInMemory([existingWarranty]);
  const updateWarrantyUsecase = new UpdateWarrantyUsecase(warrantyRepository);

  const updatedWarranty = { ...existingWarranty, terms: "Termes mis à jour" };

  const result = await updateWarrantyUsecase.execute(updatedWarranty);

  const warranties = await warrantyRepository.findAll();

  expect(result).toBeUndefined();
  expect(warranties.length).toStrictEqual(1);
  expect(warranties[0].terms).toStrictEqual("Termes mis à jour");
});

Deno.test("Should return an error when the warranty does not exist", async () => {
  const warrantyRepository = new WarrantyRepositoryInMemory([]);
  const updateWarrantyUsecase = new UpdateWarrantyUsecase(warrantyRepository);

  const nonExistentWarranty = WarrantyEntity.create(
    new Date(2012, 1, 1),
    new Date(2013, 1, 1),
    motorcycle,
    "Partial warranty (inexistent)",
    "Terms and conditions (inexistent)",
  );

  const result = await updateWarrantyUsecase.execute(nonExistentWarranty);

  expect(result).toBeInstanceOf(WarrantyNotFoundError);
});
