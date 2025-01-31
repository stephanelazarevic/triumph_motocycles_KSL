import { expect } from "jsr:@std/expect";
import { UpdateIncidentUsecase } from "../../../../../application/usecases/incident/UpdateIncidentUsecase.ts";
import { IncidentRepositoryInMemory } from "../../../../adapters/repositories/IncidentRepositoryInMemory.ts";
import { IncidentEntity } from "../../../../../domain/entities/IncidentEntity.ts";
import { IncidentType } from "../../../../../domain/enum/IncidentEnum.ts";
import { MotorcycleEntity } from "../../../../../domain/entities/MotorcycleEntity.ts";
import { Brand } from "../../../../../domain/value-objects/Brand.ts";
import { Model } from "../../../../../domain/value-objects/Model.ts";
import { IncidentNotFoundError } from "../../../../../domain/errors/IncidentNotFoundError.ts";

Deno.test("Should update an incident successfully when it exists", async () => {
  const brand = Brand.from("Triumph");
  const model = Model.from("Street Triple");

  if (brand instanceof Error) {
    throw new Error("Failed to initialize a new brand");
  }

  if (model instanceof Error) {
    throw new Error("Failed to initialize a new model");
  }

  const motorcycle = MotorcycleEntity.create(brand, model, 2024);

  const existingIncident = IncidentEntity.create(
    "Description de l'incident",
    motorcycle,
    IncidentType.BREAKDOWN,
    new Date(2010, 1, 1),
    new Date(2011, 1, 1),
    "résolue",
  );

  const incidentRepository = new IncidentRepositoryInMemory([existingIncident]);
  const updateIncidentUsecase = new UpdateIncidentUsecase(incidentRepository);

  const updatedIncident = { ...existingIncident, description: "Description mise à jour" };

  const result = await updateIncidentUsecase.execute(updatedIncident);

  const incidents = await incidentRepository.findAll();

  expect(result).toBeUndefined();
  expect(incidents.length).toStrictEqual(1);
  expect(incidents[0].description).toStrictEqual("Description mise à jour");
});

Deno.test("Should return an error when the incident does not exist", async () => {
  const incidentRepository = new IncidentRepositoryInMemory([]);
  const updateIncidentUsecase = new UpdateIncidentUsecase(incidentRepository);

  const brand = Brand.from("Yamaha");
  const model = Model.from("R1");

  if (brand instanceof Error) {
    throw new Error("Failed to initialize a new brand");
  }

  if (model instanceof Error) {
    throw new Error("Failed to initialize a new model");
  }

  const nonExistentIncident = IncidentEntity.create(
    "Description de l'incident non existant",
    MotorcycleEntity.create(brand, model, 2022),
    IncidentType.ACCIDENT,
    new Date(2020, 1, 1),
    new Date(2021, 1, 1),
    "résolue",
  );

  const result = await updateIncidentUsecase.execute(nonExistentIncident);

  expect(result).toBeInstanceOf(IncidentNotFoundError);
});
