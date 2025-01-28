import { expect } from "jsr:@std/expect";
import { FindAllWarrantiesUsecase } from "../../../../../application/usecases/warranty/FindAllWarrantiesUsecase.ts";
import { WarrantyRepositoryInMemory } from "../../../../adapters/repositories/WarrantyRepositoryInMemory.ts";
import { MotorcycleEntity } from "../../../../../domain/entities/MotorcycleEntity.ts";
import { Brand } from "../../../../../domain/types/Brand.ts";
import { Model } from "../../../../../domain/types/Model.ts";
import { WarrantyEntity } from "../../../../../domain/entities/WarrantyEntity.ts";

Deno.test("Should return an empty array when no warranties exist", async () => {
  const warrantyRepository = new WarrantyRepositoryInMemory([]);
  const findAllWarrantiesUsecase = new FindAllWarrantiesUsecase(warrantyRepository);

  const warranties = await findAllWarrantiesUsecase.execute();

  expect(warranties.length).toStrictEqual(0);
  expect(warranties).toStrictEqual([]);
});

Deno.test("Should return all warranties when they exist", async () => {
  const brand = Brand.from("Triumph");
  const model = Model.from("Street Triple");

  if (brand instanceof Error) {
    throw new Error("Failed to initialize a new brand");
  }

  if (model instanceof Error) {
    throw new Error("Failed to initialize a new model");
  }

  const motorcycle = MotorcycleEntity.create(brand, model, 2024);

  const warranty1 = WarrantyEntity.create(
    new Date(2010, 1, 1),
    new Date(2011, 1, 1),
    motorcycle,
    "Partial warranty",
    "Terms and conditions",
  );

  const warranty2 = WarrantyEntity.create(
    new Date(2014, 1, 1),
    new Date(2015, 1, 1),
    motorcycle,
    "Full warranty",
    "Terms and conditions",
  );

  const warrantyRepository = new WarrantyRepositoryInMemory([warranty1, warranty2]);
  const findAllWarrantiesUsecase = new FindAllWarrantiesUsecase(warrantyRepository);

  const warranties = await findAllWarrantiesUsecase.execute();

  expect(warranties.length).toStrictEqual(2);
  expect(warranties).toContainEqual(warranty1);
  expect(warranties).toContainEqual(warranty2);
});
