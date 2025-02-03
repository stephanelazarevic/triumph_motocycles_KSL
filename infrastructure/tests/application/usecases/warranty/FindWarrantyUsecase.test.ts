import { expect } from "jsr:@std/expect";
import { GetWarrantyUsecase } from "../../../../../application/usecases/warranty/GetWarrantyUsecase.ts";
import { WarrantyRepositoryInMemory } from "../../../../adapters/repositories/WarrantyRepositoryInMemory.ts";
import { WarrantyEntity } from "../../../../../domain/entities/WarrantyEntity.ts";
import { WarrantyNotFoundError } from "../../../../../domain/errors/WarrantyNotFoundError.ts";
import { motorcycle } from "../../../../../infrastructure/tests/fixtures/MotorcycleFixtures.ts"

Deno.test("Should return a warranty when it exists", async () => {
  const warranty = WarrantyEntity.create({
    startDate: new Date(2010, 1, 1),
    endDate: new Date(2011, 1, 1),
    motorcycle,
    type: "Partial warranty",
    terms: "Terms and conditions"
  });

  const warrantyRepository = new WarrantyRepositoryInMemory([warranty]);
  const getWarrantyUsecase = new GetWarrantyUsecase(warrantyRepository);

  const result = await getWarrantyUsecase.execute(warranty.id);

  expect(result).toStrictEqual(warranty);
});

Deno.test("Should return an error when the warranty does not exist", async () => {
  const warrantyRepository = new WarrantyRepositoryInMemory([]);
  const getWarrantyUsecase = new GetWarrantyUsecase(warrantyRepository);

  const badId = "badId";
  const result = await getWarrantyUsecase.execute(badId);

  expect(result).toBeInstanceOf(WarrantyNotFoundError);
});
