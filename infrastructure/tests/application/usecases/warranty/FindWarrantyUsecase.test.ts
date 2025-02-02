import { expect } from "jsr:@std/expect";
import { FindWarrantyUsecase } from "../../../../../application/usecases/warranty/FindWarrantyUsecase.ts";
import { WarrantyRepositoryInMemory } from "../../../../adapters/repositories/WarrantyRepositoryInMemory.ts";
import { WarrantyEntity } from "../../../../../domain/entities/WarrantyEntity.ts";
import { WarrantyNotFoundError } from "../../../../../domain/errors/WarrantyNotFoundError.ts";
import { motorcycle } from "../../../../../infrastructure/tests/fixtures/MotorcycleFixtures.ts"

Deno.test("Should return a warranty when it exists", async () => {

  const warranty = WarrantyEntity.create(
    new Date(2010, 1, 1),
    new Date(2011, 1, 1),
    motorcycle,
    "Partial warranty",
    "Terms and conditions",
  );

  const warrantyRepository = new WarrantyRepositoryInMemory([warranty]);
  const findWarrantyUsecase = new FindWarrantyUsecase(warrantyRepository);

  const result = await findWarrantyUsecase.execute(warranty.identifier);

  expect(result).toStrictEqual(warranty);
});

Deno.test("Should return an error when the warranty does not exist", async () => {
  const warrantyRepository = new WarrantyRepositoryInMemory([]);
  const findWarrantyUsecase = new FindWarrantyUsecase(warrantyRepository);

  const badId = "badId";
  const result = await findWarrantyUsecase.execute(badId);

  expect(result).toBeInstanceOf(WarrantyNotFoundError);
});
