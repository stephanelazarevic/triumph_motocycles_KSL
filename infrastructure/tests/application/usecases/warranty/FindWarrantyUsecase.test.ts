import { expect } from "jsr:@std/expect";
import { FindWarrantyUsecase } from "../../../../../application/usecases/warranty/FindWarrantyUsecase.ts";
import { WarrantyRepositoryInMemory } from "../../../../adapters/repositories/WarrantyRepositoryInMemory.ts";
import { WarrantyEntity } from "../../../../../domain/entities/WarrantyEntity.ts";
import { MotorcycleEntity } from "../../../../../domain/entities/MotorcycleEntity.ts";
import { Brand } from "../../../../../domain/types/Brand.ts";
import { Model } from "../../../../../domain/types/Model.ts";
import { WarrantyNotFoundError } from "../../../../../domain/errors/WarrantyNotFoundError.ts";

Deno.test("Should return a warranty when it exists", async () => {
  const brand = Brand.from("Triumph");
  const model = Model.from("Street Triple");

  if (brand instanceof Error) {
    throw new Error("Failed to initialize a new brand");
  }

  if (model instanceof Error) {
    throw new Error("Failed to initialize a new model");
  }

  const motorcycle = MotorcycleEntity.create(brand, model, 2024);

  const warranty = WarrantyEntity.create(
    new Date(2010, 1, 1),
    new Date(2011, 1, 1),
    motorcycle,
    "Partial warranty",
    "Terms and conditions"
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