import { expect } from "jsr:@std/expect";
import { UpdateBreakdownUsecase } from "../../../../../application/usecases/breakdown/UpdateBreakdownUsecase.ts";
import { BreakdownRepositoryInMemory } from "../../../../adapters/repositories/BreakdownRepositoryInMemory.ts";
import { BreakdownEntity } from "../../../../../domain/entities/BreakdownEntity.ts";
import { BreakdownType } from "../../../../../domain/entities/BreakdownEntity.ts";
import { MotorcycleEntity } from "../../../../../domain/entities/MotorcycleEntity.ts";
import { Brand } from "../../../../../domain/types/Brand.ts";
import { Model } from "../../../../../domain/types/Model.ts";
import { BreakdownNotFoundError } from "../../../../../domain/errors/BreakdownNotFoundError.ts";

Deno.test("Should update a breakdown successfully when it exists", async () => {
  const brand = Brand.from("Triumph");
  const model = Model.from("Street Triple");

  if (brand instanceof Error) {
    throw new Error("Failed to initialize a new brand");
  }

  if (model instanceof Error) {
    throw new Error("Failed to initialize a new model");
  }

  const motorcycle = MotorcycleEntity.create(brand, model, 2024);

  const existingBreakdown = BreakdownEntity.create(
    "Description de la panne",
    motorcycle,
    BreakdownType.PANNE,
    new Date(2010, 1, 1),
    new Date(2011, 1, 1),
    "résolue"
  );

  const breakdownRepository = new BreakdownRepositoryInMemory([existingBreakdown]);
  const updateBreakdownUsecase = new UpdateBreakdownUsecase(breakdownRepository);

  const updatedBreakdown = { ...existingBreakdown, description: "Description mise à jour" };

  const result = await updateBreakdownUsecase.execute(updatedBreakdown);

  const breakdowns = await breakdownRepository.findAll();

  expect(result).toBeUndefined(); 
  expect(breakdowns.length).toStrictEqual(1);
  expect(breakdowns[0].description).toStrictEqual("Description mise à jour");
});

Deno.test("Should return an error when the breakdown does not exist", async () => {
  const breakdownRepository = new BreakdownRepositoryInMemory([]);
  const updateBreakdownUsecase = new UpdateBreakdownUsecase(breakdownRepository);

  const brand = Brand.from("Yamaha");
  const model = Model.from("R1");

  if (brand instanceof Error) {
    throw new Error("Failed to initialize a new brand");
  }

  if (model instanceof Error) {
    throw new Error("Failed to initialize a new model");
  }

  const nonExistentBreakdown = BreakdownEntity.create(
    "Description de la panne non existante", 
    MotorcycleEntity.create(brand, model, 2022),
    BreakdownType.ACCIDENT,
    new Date(2020, 1, 1),
    new Date(2021, 1, 1),
    "résolue"
  );

  const result = await updateBreakdownUsecase.execute(nonExistentBreakdown);

  expect(result).toBeInstanceOf(BreakdownNotFoundError);
});
