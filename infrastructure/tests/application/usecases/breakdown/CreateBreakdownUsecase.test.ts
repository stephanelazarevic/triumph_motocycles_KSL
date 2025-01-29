import { expect } from "jsr:@std/expect";
import { CreateBreakdownUsecase } from "../../../../../application/usecases/breakdown/CreateBreakdownUsecase.ts";
import { BreakdownRepositoryInMemory } from "../../../../adapters/repositories/BreakdownRepositoryInMemory.ts";
import { MotorcycleRepositoryInMemory } from "../../../../adapters/repositories/MotorcycleRepositoryInMemory.ts";
import { MotorcycleEntity } from "../../../../../domain/entities/MotorcycleEntity.ts";
import { Brand } from "../../../../../domain/value-objects/Brand.ts";
import { Model } from "../../../../../domain/value-objects/Model.ts";
import { BadStatusError } from "../../../../../domain/errors/BadStatusError.ts";
import { MotorcycleNotFoundError } from "../../../../../domain/errors/MotorcycleNotFoundError.ts";
import { BreakdownInvalidTypeError } from "../../../../../domain/errors/BreakdownInvalidTypeError.ts";
import { EmptyDescriptionError } from "../../../../../domain/errors/EmptyDescriptionError.ts";
import { BreakdownType } from "../../../../../domain/enum/BreakdownEnum.ts";
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

const motorcycleRepository = new MotorcycleRepositoryInMemory([
  motorcycle,
]);

Deno.test("Should return an error if the description is empty", async () => {
  const createBreakdownUsecase = new CreateBreakdownUsecase(breakdownRepository, motorcycleRepository);
  const result = await createBreakdownUsecase.execute(
    "",
    motorcycle.identifier,
    type,
    reportDate,
    resolutionDate,
    status,
  );

  expect(result).toBeInstanceOf(EmptyDescriptionError);
});

Deno.test("Should return an error if the motorcycle does not exist", async () => {
  const createBreakdownUsecase = new CreateBreakdownUsecase(breakdownRepository, motorcycleRepository);
  const result = await createBreakdownUsecase.execute(description, "", type, reportDate, resolutionDate, status);

  expect(result).toBeInstanceOf(MotorcycleNotFoundError);
});

Deno.test("Should return an error if the type is invalid", async () => {
  const createBreakdownUsecase = new CreateBreakdownUsecase(breakdownRepository, motorcycleRepository);
  const invalidBreakdownType = "INVALID_TYPE" as unknown as BreakdownType;
  const result = await createBreakdownUsecase.execute(
    description,
    motorcycle.identifier,
    invalidBreakdownType,
    reportDate,
    resolutionDate,
    status,
  );

  expect(result).toBeInstanceOf(BreakdownInvalidTypeError);
});

Deno.test("Should return an error if the reportDate is invalid", async () => {
  const createBreakdownUsecase = new CreateBreakdownUsecase(breakdownRepository, motorcycleRepository);
  const badReportDate = new Date(2005, 1, 1);
  const result = await createBreakdownUsecase.execute(
    description,
    motorcycle.identifier,
    type,
    badReportDate,
    resolutionDate,
    status,
  );

  expect(result).toBeInstanceOf(InvalidDateError);
});

Deno.test("Should return an error if the resolutionDate is invalid", async () => {
  const createBreakdownUsecase = new CreateBreakdownUsecase(breakdownRepository, motorcycleRepository);
  const badResolutionDate = new Date(2005, 1, 1);
  const result = await createBreakdownUsecase.execute(
    description,
    motorcycle.identifier,
    type,
    reportDate,
    badResolutionDate,
    status,
  );

  expect(result).toBeInstanceOf(InvalidDateError);
});

Deno.test("Should return an error if the resolutionDate is before the reportDate", async () => {
  const createBreakdownUsecase = new CreateBreakdownUsecase(breakdownRepository, motorcycleRepository);
  const badReportDate = new Date(2006, 1, 1);
  const badResolutionDate = new Date(2005, 1, 1);
  const result = await createBreakdownUsecase.execute(
    description,
    motorcycle.identifier,
    type,
    badReportDate,
    badResolutionDate,
    status,
  );

  expect(result).toBeInstanceOf(InvalidDateError);
});

Deno.test("Should return an error if the status is invalid", async () => {
  const createBreakdownUsecase = new CreateBreakdownUsecase(breakdownRepository, motorcycleRepository);
  const result = await createBreakdownUsecase.execute(
    description,
    motorcycle.identifier,
    type,
    reportDate,
    resolutionDate,
    "status",
  );

  expect(result).toBeInstanceOf(BadStatusError);
});

Deno.test("Should succeed when creating a breakdown correctly", async () => {
  const createBreakdownUsecase = new CreateBreakdownUsecase(breakdownRepository, motorcycleRepository);
  const result = await createBreakdownUsecase.execute(
    description,
    motorcycle.identifier,
    type,
    reportDate,
    resolutionDate,
    status,
  );

  const breakdowns = await breakdownRepository.findAll();

  expect(result).not.toBeInstanceOf(Error);

  expect(breakdowns.length).toStrictEqual(1);
  expect(breakdowns[0].description).toStrictEqual(description);
  expect(breakdowns[0].type).toStrictEqual(BreakdownType.PANNE);
  expect(breakdowns[0].motorcycle).toStrictEqual(motorcycle);
  expect(breakdowns[0].reportDate).toStrictEqual(reportDate);
  expect(breakdowns[0].resolutionDate).toStrictEqual(resolutionDate);
  expect(breakdowns[0].status).toStrictEqual(status);
});
