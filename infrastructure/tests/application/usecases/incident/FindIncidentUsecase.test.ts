import { expect } from "jsr:@std/expect";
import { FindIncidentUsecase } from "../../../../../application/usecases/incident/FindIncidentUsecase.ts";
import { IncidentRepositoryInMemory } from "../../../../adapters/repositories/IncidentRepositoryInMemory.ts";
import { IncidentEntity } from "../../../../../domain/entities/IncidentEntity.ts";
import { IncidentType } from "../../../../../domain/enum/IncidentEnum.ts";
import { MotorcycleEntity } from "../../../../../domain/entities/MotorcycleEntity.ts";
import { Brand } from "../../../../../domain/value-objects/Brand.ts";
import { Model } from "../../../../../domain/value-objects/Model.ts";
import { IncidentNotFoundError } from "../../../../../domain/errors/IncidentNotFoundError.ts";

Deno.test("Should return a incident when it exists", async () => {
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
  const incident = IncidentEntity.create({
    description: "Incident description",
    motorcycle,
    type: IncidentType.BREAKDOWN,
    reportDate: new Date(2010, 1, 1),
    resolutionDate: new Date(2011, 1, 1),
    status: "resolved"
  });

  const incidentRepository = new IncidentRepositoryInMemory([incident]);
  const findIncidentUsecase = new FindIncidentUsecase(incidentRepository);

  const result = await findIncidentUsecase.execute(incident.id);

  expect(result).toStrictEqual(incident);
});

Deno.test("Should return an error when the incident does not exist", async () => {
  const incidentRepository = new IncidentRepositoryInMemory([]);
  const findIncidentUsecase = new FindIncidentUsecase(incidentRepository);

  const badId = "badId";
  const result = await findIncidentUsecase.execute(badId);

  expect(result).toBeInstanceOf(IncidentNotFoundError);
});
