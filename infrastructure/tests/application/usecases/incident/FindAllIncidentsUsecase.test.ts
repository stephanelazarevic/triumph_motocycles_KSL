import { expect } from "jsr:@std/expect";
import { FindAllIncidentsUsecase } from "../../../../../application/usecases/incident/FindAllIncidentsUsecase.ts";
import { IncidentRepositoryInMemory } from "../../../../adapters/repositories/IncidentRepositoryInMemory.ts";
import { IncidentEntity } from "../../../../../domain/entities/IncidentEntity.ts";
import { IncidentType } from "../../../../../domain/enum/IncidentEnum.ts";
import { MotorcycleEntity } from "../../../../../domain/entities/MotorcycleEntity.ts";
import { Brand } from "../../../../../domain/value-objects/Brand.ts";
import { Model } from "../../../../../domain/value-objects/Model.ts";

Deno.test("Should return an empty array when no incidents exist", async () => {
  const incidentRepository = new IncidentRepositoryInMemory([]);
  const findAllIncidentsUsecase = new FindAllIncidentsUsecase(incidentRepository);

  const incidents = await findAllIncidentsUsecase.execute();

  expect(incidents.length).toStrictEqual(0);
  expect(incidents).toStrictEqual([]);
});

Deno.test("Should return all incidents when they exist", async () => {
  const brand = Brand.from("Triumph");
  const model = Model.from("Street Triple");

  if (brand instanceof Error) {
    throw new Error("Failed to initialize a new brand");
  }

  if (model instanceof Error) {
    throw new Error("Failed to initialize a new model");
  }

  const motorcycle = MotorcycleEntity.create({
    brand,
    model,
    year:2024
  });

  const incident1 = IncidentEntity.create({
    description: "Incident 1 description",
    motorcycle,
    type: IncidentType.BREAKDOWN,
    reportDate: new Date(2010, 1, 1),
    resolutionDate: new Date(2011, 1, 1),
    status: "resolved"
  });


  const incident2 = IncidentEntity.create({
    description: "Incident 2 description",
    motorcycle,
    type: IncidentType.BREAKDOWN,
    reportDate: new Date(2015, 1, 1),
    resolutionDate: new Date(2016, 1, 1),
    status: "resolved"
  });

  const incidentRepository = new IncidentRepositoryInMemory([incident1, incident2]);
  const findAllIncidentsUsecase = new FindAllIncidentsUsecase(incidentRepository);

  const incidents = await findAllIncidentsUsecase.execute();

  expect(incidents.length).toStrictEqual(2);
  expect(incidents).toContainEqual(incident1);
  expect(incidents).toContainEqual(incident2);
});
