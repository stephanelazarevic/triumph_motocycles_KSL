import { expect } from "jsr:@std/expect";
import { DeleteBreakdownUsecase } from "../../../../../application/usecases/breakdown/DeleteBreakdownUsecase.ts";
import { BreakdownRepositoryInMemory } from "../../../../adapters/repositories/BreakdownRepositoryInMemory.ts";
import { BreakdownEntity } from "../../../../../domain/entities/BreakdownEntity.ts";
import { BreakdownNotFoundError } from "../../../../../domain/errors/BreakdownNotFoundError.ts";
import { BreakdownType } from "../../../../../domain/enum/BreakdownEnum.ts";
import { MotorcycleEntity } from "../../../../../domain/entities/MotorcycleEntity.ts";
import { Brand } from "../../../../../domain/types/Brand.ts";
import { Model } from "../../../../../domain/types/Model.ts";
import { InvalidDateError } from "../../../../../domain/errors/InvalidDateError.ts";

const breakdownRepository = new BreakdownRepositoryInMemory([]);

const brand = Brand.from("Triumph");
const model = Model.from("Street Triple");

if (brand instanceof Error) {
  throw new Error("Failed to initialize a new brand");
}

if (model instanceof Error) {
  throw new Error("Failed to initialize a new model");
}

const motorcycle = MotorcycleEntity.create(brand, model, 2024);
const description = "Breakdown description";
const type = BreakdownType.PANNE;
const reportDate = new Date(2010, 1, 1);
const resolutionDate = new Date(2011, 1, 1);
const status = "resolved";

if (reportDate || resolutionDate instanceof Error) {
  throw new InvalidDateError("Invalid date");
}

const breakdown = BreakdownEntity.create(
  description,
  motorcycle,
  type,
  reportDate,
  resolutionDate,
  status
);

breakdownRepository.save(breakdown);

Deno.test("Should delete a breakdown successfully", async () => {
  const deleteBreakdownUsecase = new DeleteBreakdownUsecase(breakdownRepository);

  const breakdownsBefore = await breakdownRepository.findAll();
  expect(breakdownsBefore.length).toStrictEqual(1);

  await deleteBreakdownUsecase.execute(breakdown.identifier);

  const breakdownsAfter = await breakdownRepository.findAll();
  expect(breakdownsAfter.length).toStrictEqual(0);
});

Deno.test("Should return an error if the breakdown does not exist", async () => {
  const deleteBreakdownUsecase = new DeleteBreakdownUsecase(breakdownRepository);
  const badId = "badId";

  const result = await deleteBreakdownUsecase.execute(badId);

  expect(result).toBeInstanceOf(BreakdownNotFoundError);
});
