import { expect } from "jsr:@std/expect";
import { UpdateIncidentUsecase } from "../../../../../application/usecases/incident/UpdateIncidentUsecase.ts";
import { IncidentRepositoryInMemory } from "../../../../adapters/repositories/IncidentRepositoryInMemory.ts";
import { IncidentEntity } from "../../../../../domain/entities/IncidentEntity.ts";
import { IncidentType } from "../../../../../domain/enum/IncidentEnum.ts";
import { IncidentNotFoundError } from "../../../../../domain/errors/IncidentNotFoundError.ts";
import { motorcycle } from "../../../../../infrastructure/tests/fixtures/MotorcycleFixtures.ts"

Deno.test("Should update an incident successfully when it exists", async () => {

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

  const nonExistentIncident = IncidentEntity.create(
    "Description de l'incident non existant",
    motorcycle,
    IncidentType.ACCIDENT,
    new Date(2020, 1, 1),
    new Date(2021, 1, 1),
    "résolue",
  );

  const result = await updateIncidentUsecase.execute(nonExistentIncident);

  expect(result).toBeInstanceOf(IncidentNotFoundError);
});
