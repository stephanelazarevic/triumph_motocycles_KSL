import { expect } from "jsr:@std/expect";
import { UpdateIncidentUsecase } from "../../../../../application/usecases/incident/UpdateIncidentUsecase.ts";
import { IncidentRepositoryInMemory } from "../../../../adapters/repositories/IncidentRepositoryInMemory.ts";
import { IncidentEntity } from "../../../../../domain/entities/IncidentEntity.ts";
import { IncidentType } from "../../../../../domain/enum/IncidentEnum.ts";
import { IncidentNotFoundError } from "../../../../../domain/errors/IncidentNotFoundError.ts";
import { motorcycle } from "../../../../../infrastructure/tests/fixtures/MotorcycleFixtures.ts"

Deno.test("Should update an incident successfully when it exists", async () => {
  const existingIncident = IncidentEntity.create({
    description:"Description de l'incident",
    motorcycle,
    type: IncidentType.BREAKDOWN,
    reportDate: new Date(2010, 1, 1),
    resolutionDate: new Date(2011, 1, 1),
    status: "résolue",
  });

  const incidentRepository = new IncidentRepositoryInMemory([existingIncident]);
  const updateIncidentUsecase = new UpdateIncidentUsecase(incidentRepository);

  const updatedIncident = { ...existingIncident, description: "Description mise à jour" };

  const result = await updateIncidentUsecase.execute(existingIncident.id, updatedIncident);

  const incidents = await incidentRepository.findAll();

  expect(result).toBeUndefined();
  expect(incidents.length).toStrictEqual(1);
  expect(incidents[0].description).toStrictEqual("Description mise à jour");
});

Deno.test("Should return an error when the incident does not exist", async () => {
  const incidentRepository = new IncidentRepositoryInMemory([]);
  const updateIncidentUsecase = new UpdateIncidentUsecase(incidentRepository);

  const nonExistingIncident = IncidentEntity.create({
    description: "Description de l'incident",
    motorcycle,
    type: IncidentType.ACCIDENT,
    reportDate: new Date(2020, 1, 1),
    resolutionDate: new Date(2021, 1, 1),
    status: "résolue",
  });
  const result = await updateIncidentUsecase.execute("blabla", nonExistingIncident);

  expect(result).toBeInstanceOf(IncidentNotFoundError);
});
