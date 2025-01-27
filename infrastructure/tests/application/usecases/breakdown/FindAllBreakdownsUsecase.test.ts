import { expect } from "jsr:@std/expect";
import { FindAllBreakdownsUsecase } from "../../../../../application/usecases/breakdown/FindAllBreakdownsUsecase.ts";
import { BreakdownRepositoryInMemory } from "../../../../adapters/repositories/BreakdownRepositoryInMemory.ts";
import { BreakdownEntity } from "../../../../../domain/entities/BreakdownEntity.ts";
import { BreakdownType } from "../../../../../domain/enum/BreakdownEnum.ts";
import { MotorcycleEntity } from "../../../../../domain/entities/MotorcycleEntity.ts";
import { Brand } from "../../../../../domain/types/Brand.ts";
import { Model } from "../../../../../domain/types/Model.ts";

Deno.test("Should return an empty array when no breakdowns exist", async () => {
  const breakdownRepository = new BreakdownRepositoryInMemory([]);
  const findAllBreakdownsUsecase = new FindAllBreakdownsUsecase(breakdownRepository);

  const breakdowns = await findAllBreakdownsUsecase.execute();

  expect(breakdowns.length).toStrictEqual(0);
  expect(breakdowns).toStrictEqual([]);
});

Deno.test("Should return all breakdowns when they exist", async () => {
  const brand = Brand.from("Triumph");
  const model = Model.from("Street Triple");

  if (brand instanceof Error) {
    throw new Error("Failed to initialize a new brand");
  }

  if (model instanceof Error) {
    throw new Error("Failed to initialize a new model");
  }

  const motorcycle = MotorcycleEntity.create(brand, model, 2024);

  const breakdown1 = BreakdownEntity.create(
    "Breakdown 1 description",
    motorcycle,
    BreakdownType.PANNE,
    new Date(2010, 1, 1),
    new Date(2011, 1, 1),
    "resolved"
  );

  const breakdown2 = BreakdownEntity.create(
    "Breakdown 2 description",
    motorcycle,
    BreakdownType.ACCIDENT,
    new Date(2015, 1, 1),
    new Date(2016, 1, 1),
    "resolved"
  );

  const breakdownRepository = new BreakdownRepositoryInMemory([breakdown1, breakdown2]);
  const findAllBreakdownsUsecase = new FindAllBreakdownsUsecase(breakdownRepository);

  const breakdowns = await findAllBreakdownsUsecase.execute();

  expect(breakdowns.length).toStrictEqual(2);
  expect(breakdowns).toContainEqual(breakdown1);
  expect(breakdowns).toContainEqual(breakdown2);
});
