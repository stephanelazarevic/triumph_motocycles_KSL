import { expect } from "jsr:@std/expect";
import { AddIncidentUsecase } from "../../../../../application/usecases/incident/AddIncidentUsecase.ts";
import { IncidentRepositoryInMemory } from "../../../../adapters/repositories/IncidentRepositoryInMemory.ts";
import { MotorcycleRepositoryInMemory } from "../../../../adapters/repositories/MotorcycleRepositoryInMemory.ts";
import { BadStatusError } from "../../../../../domain/errors/BadStatusError.ts";
import { MotorcycleNotFoundError } from "../../../../../domain/errors/MotorcycleNotFoundError.ts";
import { IncidentInvalidTypeError } from "../../../../../domain/errors/IncidentInvalidTypeError.ts";
import { EmptyDescriptionError } from "../../../../../domain/errors/EmptyDescriptionError.ts";
import { IncidentType } from "../../../../../domain/enum/IncidentEnum.ts";
import { InvalidDateError } from "../../../../../domain/errors/InvalidDateError.ts";
import { motorcycle } from "../../../fixtures/MotorcycleFixtures.ts"

const incidentRepository = new IncidentRepositoryInMemory([]);

const description = "Breakdown description";
const type = IncidentType.BREAKDOWN;
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
  const addIncidentUsecase = new AddIncidentUsecase(incidentRepository, motorcycleRepository);
  const result = await addIncidentUsecase.execute({
    description: "",
    motorcycleId: motorcycle.id,
    type,
    reportDate,
    resolutionDate,
    status,
  });

  expect(result).toBeInstanceOf(EmptyDescriptionError);
});

Deno.test("Should return an error if the motorcycle does not exist", async () => {
  const addIncidentUsecase = new AddIncidentUsecase(incidentRepository, motorcycleRepository);
  const result = await addIncidentUsecase.execute(description, "", type, reportDate, resolutionDate, status);

  expect(result).toBeInstanceOf(MotorcycleNotFoundError);
});

Deno.test("Should return an error if the type is invalid", async () => {
  const addIncidentUsecase = new AddIncidentUsecase(incidentRepository, motorcycleRepository);
  const invalidIncidentType = "INVALID_TYPE" as unknown as IncidentType;
  const result = await addIncidentUsecase.execute({
    description,
    motorcycleId: motorcycle.id,
    type: invalidIncidentType,
    reportDate,
    resolutionDate,
    status,
  });

  expect(result).toBeInstanceOf(IncidentInvalidTypeError);
});

Deno.test("Should return an error if the reportDate is invalid", async () => {
  const addIncidentUsecase = new AddIncidentUsecase(incidentRepository, motorcycleRepository);
  const badReportDate = new Date(2005, 1, 1);
  const result = await addIncidentUsecase.execute({
    description,
    motorcycleId: motorcycle.id,
    type,
    reportDate: badReportDate,
    resolutionDate,
    status,
  });

  expect(result).toBeInstanceOf(InvalidDateError);
});

Deno.test("Should return an error if the resolutionDate is invalid", async () => {
  const addIncidentUsecase = new AddIncidentUsecase(incidentRepository, motorcycleRepository);
  const badResolutionDate = new Date(2005, 1, 1);
  const result = await addIncidentUsecase.execute({
    description,
    motorcycleId: motorcycle.id,
    type,
    reportDate,
    resolutionDate: badResolutionDate,
    status,
  });

  expect(result).toBeInstanceOf(InvalidDateError);
});

Deno.test("Should return an error if the resolutionDate is before the reportDate", async () => {
  const addIncidentUsecase = new AddIncidentUsecase(incidentRepository, motorcycleRepository);
  const badReportDate = new Date(2006, 1, 1);
  const badResolutionDate = new Date(2005, 1, 1);
  const result = await addIncidentUsecase.execute({
    description,
    motorcycleId: motorcycle.id,
    type,
    reportDate: badReportDate,
    resolutionDate: badResolutionDate,
    status,
  });

  expect(result).toBeInstanceOf(InvalidDateError);
});

Deno.test("Should return an error if the status is invalid", async () => {
  const addIncidentUsecase = new AddIncidentUsecase(incidentRepository, motorcycleRepository);
  const result = await addIncidentUsecase.execute({
    description,
    motorcycleId: motorcycle.id,
    type,
    reportDate,
    resolutionDate,
    status: "status",
  });

  expect(result).toBeInstanceOf(BadStatusError);
});

Deno.test("Should succeed when creating a incident correctly", async () => {
  const addIncidentUsecase = new AddIncidentUsecase(incidentRepository, motorcycleRepository);
  const result = await addIncidentUsecase.execute({
    description,
    motorcycleId: motorcycle.id,
    type,
    reportDate,
    resolutionDate,
    status,
  });

  const incidents = await incidentRepository.findAll();

  expect(result).not.toBeInstanceOf(Error);

  expect(incidents.length).toStrictEqual(1);
  expect(incidents[0].description).toStrictEqual(description);
  expect(incidents[0].type).toStrictEqual(IncidentType.BREAKDOWN);
  expect(incidents[0].motorcycle).toStrictEqual(motorcycle);
  expect(incidents[0].reportDate).toStrictEqual(reportDate);
  expect(incidents[0].resolutionDate).toStrictEqual(resolutionDate);
  expect(incidents[0].status).toStrictEqual(status);
});
