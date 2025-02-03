import { expect } from "jsr:@std/expect";
import { GetIncidentUsecase } from "../../../../../application/usecases/incident/GetIncidentUsecase.ts";
import { IncidentRepositoryInMemory } from "../../../../adapters/repositories/IncidentRepositoryInMemory.ts";
import { IncidentEntity } from "../../../../../domain/entities/IncidentEntity.ts";
import { IncidentType } from "../../../../../domain/enum/IncidentEnum.ts";
import { IncidentNotFoundError } from "../../../../../domain/errors/IncidentNotFoundError.ts";
import { motorcycle } from "../../../fixtures/MotorcycleFixtures.ts"

Deno.test("Should return a incident when it exists", async () => {
  const incident = IncidentEntity.create({
    description: "Incident description",
    motorcycle,
    type: IncidentType.BREAKDOWN,
    reportDate: new Date(2010, 1, 1),
    resolutionDate: new Date(2011, 1, 1),
    status: "resolved"
  });

  const incidentRepository = new IncidentRepositoryInMemory([incident]);
  const getIncidentUsecase = new GetIncidentUsecase(incidentRepository);

  const result = await getIncidentUsecase.execute(incident.id);

  expect(result).toStrictEqual(incident);
});

Deno.test("Should return an error when the incident does not exist", async () => {
  const incidentRepository = new IncidentRepositoryInMemory([]);
  const getIncidentUsecase = new GetIncidentUsecase(incidentRepository);

  const badId = "badId";
  const result = await getIncidentUsecase.execute(badId);

  expect(result).toBeInstanceOf(IncidentNotFoundError);
});
