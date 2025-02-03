import { expect } from "jsr:@std/expect";
import { ListWarrantiesUsecase } from "../../../../../application/usecases/warranty/ListWarrantiesUsecase.ts";
import { WarrantyRepositoryInMemory } from "../../../../adapters/repositories/WarrantyRepositoryInMemory.ts";
import { WarrantyEntity } from "../../../../../domain/entities/WarrantyEntity.ts";
import { motorcycle } from "../../../../../infrastructure/tests/fixtures/MotorcycleFixtures.ts"

Deno.test("Should return an empty array when no warranties exist", async () => {
  const warrantyRepository = new WarrantyRepositoryInMemory([]);
  const listWarrantiesUsecase = new ListWarrantiesUsecase(warrantyRepository);

  const warranties = await listWarrantiesUsecase.execute();

  expect(warranties.length).toStrictEqual(0);
  expect(warranties).toStrictEqual([]);
});

Deno.test("Should return all warranties when they exist", async () => {
  const warranty1 = WarrantyEntity.create({
    startDate: new Date(2010, 1, 1),
    endDate: new Date(2011, 1, 1),
    motorcycle,
    type: "Partial warranty",
    terms: "Terms and conditions"
  });

  const warranty2 = WarrantyEntity.create({
    startDate: new Date(2014, 1, 1),
    endDate: new Date(2015, 1, 1),
    motorcycle,
    type: "Full warranty",
    terms: "Terms and conditions"
  });

  const warrantyRepository = new WarrantyRepositoryInMemory([warranty1, warranty2]);
  const listWarrantiesUsecase = new ListWarrantiesUsecase(warrantyRepository);

  const warranties = await listWarrantiesUsecase.execute();

  expect(warranties.length).toStrictEqual(2);
  expect(warranties).toContainEqual(warranty1);
  expect(warranties).toContainEqual(warranty2);
});
