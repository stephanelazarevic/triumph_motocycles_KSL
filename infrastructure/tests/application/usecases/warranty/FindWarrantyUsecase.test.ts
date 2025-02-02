import { expect } from "jsr:@std/expect";
import { FindWarrantyUsecase } from "../../../../../application/usecases/warranty/FindWarrantyUsecase.ts";
import { WarrantyRepositoryInMemory } from "../../../../adapters/repositories/WarrantyRepositoryInMemory.ts";
import { WarrantyEntity } from "../../../../../domain/entities/WarrantyEntity.ts";
import { MotorcycleEntity } from "../../../../../domain/entities/MotorcycleEntity.ts";
import { Brand } from "../../../../../domain/value-objects/Brand.ts";
import { Model } from "../../../../../domain/value-objects/Model.ts";
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

  const motorcycle = MotorcycleEntity.create({
    brand,
    model,
    year: 2024
  });

  const warranty = WarrantyEntity.create({
    startDate: new Date(2010, 1, 1),
    endDate: new Date(2011, 1, 1),
    motorcycle,
    warrantyType: "Partial warranty",
    terms: "Terms and conditions"
  });

  const warrantyRepository = new WarrantyRepositoryInMemory([warranty]);
  const findWarrantyUsecase = new FindWarrantyUsecase(warrantyRepository);

  const result = await findWarrantyUsecase.execute(warranty.id);

  expect(result).toStrictEqual(warranty);
});

Deno.test("Should return an error when the warranty does not exist", async () => {
  const warrantyRepository = new WarrantyRepositoryInMemory([]);
  const findWarrantyUsecase = new FindWarrantyUsecase(warrantyRepository);

  const badId = "badId";
  const result = await findWarrantyUsecase.execute(badId);

  expect(result).toBeInstanceOf(WarrantyNotFoundError);
});
