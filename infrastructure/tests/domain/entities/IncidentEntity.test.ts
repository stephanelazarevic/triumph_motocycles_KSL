import { expect } from "jsr:@std/expect";
import { MotorcycleEntity } from "../../../../domain/entities/MotorcycleEntity.ts";
import { IncidentEntity } from "../../../../domain/entities/IncidentEntity.ts";
import { IncidentType } from "../../../../domain/enum/IncidentEnum.ts";
import { Brand } from "../../../../domain/value-objects/Brand.ts";
import { Model } from "../../../../domain/value-objects/Model.ts";

Deno.test("Shoud return an incident entity", () => {
  const brand = Brand.from("Triumph");

  if (brand instanceof Error) {
    throw brand;
  }

  const model = Model.from("Street Triple");

  if (model instanceof Error) {
    throw model;
  }

  const year = 2024;
  const description = "Incident description";
  const motorcycle = MotorcycleEntity.create({brand, model, year});
  const type = IncidentType.ACCIDENT;
  const reportDate = new Date(2019, 1, 1);
  const resolutionDate = new Date(2020, 2, 1);
  const status = "Resolved";

  const result = IncidentEntity.create({
    description,
    motorcycle,
    type,
    reportDate,
    resolutionDate,
    status
  });

  expect(result.description).toStrictEqual("Incident description");
  expect(result.motorcycle.brand.value).toStrictEqual("Triumph");
  expect(result.motorcycle.model.value).toStrictEqual("Street Triple");
  expect(result.motorcycle.year).toStrictEqual(2024);
  expect(result.reportDate.toISOString()).toStrictEqual(new Date(2019, 1, 1).toISOString());
  expect(result.type).toStrictEqual(IncidentType.ACCIDENT);
  expect(result.resolutionDate.toISOString()).toStrictEqual(new Date(2020, 2, 1).toISOString());
  expect(result.status).toStrictEqual("Resolved");
});

Deno.test("Should throw error for invalid incident entity data", () => {
  const brand = Brand.from("");
  if (!(brand instanceof Error)) {
    throw new Error("Invalid brand");
  }

  const model = Model.from("");
  if (!(model instanceof Error)) {
    throw new Error("Invalid model");
  }

  const motorcycle = MotorcycleEntity.create({
    brand: brand as never,
    model: model as never,
    year: 2024
  });

  const description = "";
  const type = IncidentType.ACCIDENT;
  const reportDate = new Date(2019, 1, 1);
  const resolutionDate = new Date(2020, 2, 1);
  const status = "";

  expect(() => {
    IncidentEntity.create({
      description,
      motorcycle,
      type,
      reportDate: reportDate as never,
      resolutionDate: resolutionDate as never,
      status
    });
  }).toThrow();
});
