import { expect } from "jsr:@std/expect";
import { FindBreakdownUsecase } from "../../../../../application/usecases/breakdown/FindBreakdownUsecase.ts";
import { BreakdownRepositoryInMemory } from "../../../../adapters/repositories/BreakdownRepositoryInMemory.ts";
import { BreakdownEntity } from "../../../../../domain/entities/BreakdownEntity.ts";
import { BreakdownType } from "../../../../../domain/enum/BreakdownEnum.ts";
import { MotorcycleEntity } from "../../../../../domain/entities/MotorcycleEntity.ts";
import { Brand } from "../../../../../domain/types/Brand.ts";
import { Model } from "../../../../../domain/types/Model.ts";
import { BreakdownNotFoundError } from "../../../../../domain/errors/BreakdownNotFoundError.ts";

Deno.test("Should return a breakdown when it exists", async () => {
  const brand = Brand.from("Triumph");
  const model = Model.from("Street Triple");

  if (brand instanceof Error) {
    throw new Error("Failed to initialize a new brand");
  }

  if (model instanceof Error) {
    throw new Error("Failed to initialize a new model");
  }

  const motorcycle = MotorcycleEntity.create(brand, model, 2024);

  const breakdown = BreakdownEntity.create(
    "Breakdown description",
    motorcycle,
    BreakdownType.PANNE,
    new Date(2010, 1, 1),
    new Date(2011, 1, 1),
    "resolved",
  );

  const breakdownRepository = new BreakdownRepositoryInMemory([breakdown]);
  const findBreakdownUsecase = new FindBreakdownUsecase(breakdownRepository);

  const result = await findBreakdownUsecase.execute(breakdown.identifier);

  expect(result).toStrictEqual(breakdown);
});

Deno.test("Should return an error when the breakdown does not exist", async () => {
  const breakdownRepository = new BreakdownRepositoryInMemory([]);
  const findBreakdownUsecase = new FindBreakdownUsecase(breakdownRepository);

  const badId = "badId";
  const result = await findBreakdownUsecase.execute(badId);

  expect(result).toBeInstanceOf(BreakdownNotFoundError);
});
