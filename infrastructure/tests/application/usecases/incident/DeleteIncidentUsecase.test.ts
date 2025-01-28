import { expect } from "jsr:@std/expect";
import { DeleteIncidentUsecase } from "../../../../../application/usecases/breakdown/DeleteIncidentUsecase.ts";
import { IncidentRepositoryInMemory } from "../../../../adapters/repositories/IncidentRepositoryInMemory.ts";
import { IncidentEntity } from "../../../../../domain/entities/IncidentEntity.ts";
import { IncidentNotFoundError } from "../../../../../domain/errors/IncidentNotFoundError.ts";
import { IncidentType } from "../../../../../domain/enum/IncidentEnum.ts";
import { MotorcycleEntity } from "../../../../../domain/entities/MotorcycleEntity.ts";
import { Brand } from "../../../../../domain/types/Brand.ts";
import { Model } from "../../../../../domain/types/Model.ts";
import { InvalidDateError } from "../../../../../domain/errors/InvalidDateError.ts";

const incidentRepository = new IncidentRepositoryInMemory([]);

const brand = Brand.from("Triumph");
const model = Model.from("Street Triple");

if (brand instanceof Error) {
  throw new Error("Failed to initialize a new brand");
}

if (model instanceof Error) {
  throw new Error("Failed to initialize a new model");
}

const motorcycle = MotorcycleEntity.create(brand, model, 2024);
const description = "Incident description";
const type = IncidentType.BREAKDOWN;
const reportDate = new Date(2010, 1, 1);
const resolutionDate = new Date(2011, 1, 1);
const status = "resolved";

if (reportDate || resolutionDate instanceof Error) {
  throw new InvalidDateError("Invalid date");
}

const incident = IncidentEntity.create(
  description,
  motorcycle,
  type,
  reportDate,
  resolutionDate,
  status
);

incidentRepository.save(incident);

Deno.test("Should delete an incident successfully", async () => {
  const deleteIncidentUsecase = new DeleteIncidentUsecase(incidentRepository);

  const incidentsBefore = await incidentRepository.findAll();
  expect(incidentsBefore.length).toStrictEqual(1);

  await deleteIncidentUsecase.execute(incident.identifier);

  const incidentsAfter = await incidentRepository.findAll();
  expect(incidentsAfter.length).toStrictEqual(0);
});

Deno.test("Should return an error if the incident does not exist", async () => {
  const deleteIncidentUsecase = new DeleteIncidentUsecase(incidentRepository);
  const badId = "badId";

  const result = await deleteIncidentUsecase.execute(badId);

  expect(result).toBeInstanceOf(IncidentNotFoundError);
});
