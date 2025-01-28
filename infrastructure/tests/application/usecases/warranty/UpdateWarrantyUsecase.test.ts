import { expect } from "jsr:@std/expect";
import { UpdateWarrantyUsecase } from "../../../../../application/usecases/warranty/UpdateWarrantyUsecase.ts";
import { WarrantyRepositoryInMemory } from "../../../../adapters/repositories/WarrantyRepositoryInMemory.ts";
import { WarrantyEntity } from "../../../../../domain/entities/WarrantyEntity.ts";
import { MotorcycleEntity } from "../../../../../domain/entities/MotorcycleEntity.ts";
import { Brand } from "../../../../../domain/types/Brand.ts";
import { Model } from "../../../../../domain/types/Model.ts";
import { WarrantyNotFoundError } from "../../../../../domain/errors/WarrantyNotFoundError.ts";

Deno.test("Should update a warranty successfully when it exists", async () => {
  const brand = Brand.from("Triumph");
  const model = Model.from("Street Triple");

  if (brand instanceof Error) {
    throw new Error("Failed to initialize a new brand");
  }

  if (model instanceof Error) {
    throw new Error("Failed to initialize a new model");
  }

  const motorcycle = MotorcycleEntity.create(brand, model, 2024);

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

  const brand = Brand.from("Yamaha");
  const model = Model.from("R1");

  if (brand instanceof Error) {
    throw new Error("Failed to initialize a new brand");
  }

  if (model instanceof Error) {
    throw new Error("Failed to initialize a new model");
  }

  const nonExistentWarranty = WarrantyEntity.create(
    new Date(2012, 1, 1),
    new Date(2013, 1, 1),
    MotorcycleEntity.create(brand, model, 2024),
    "Partial warranty (inexistent)",
    "Terms and conditions (inexistent)",
  );

  const result = await updateWarrantyUsecase.execute(nonExistentWarranty);

  expect(result).toBeInstanceOf(WarrantyNotFoundError);
});
