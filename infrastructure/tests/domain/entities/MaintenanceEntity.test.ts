import { expect } from "jsr:@std/expect";
import { Brand } from "../../../../domain/value-objects/Brand.ts";
import { Model } from "../../../../domain/value-objects/Model.ts";
import { MaintenanceEntity } from "../../../../domain/entities/MaintenanceEntity.ts";
import { InvalidDateError } from "../../../../domain/errors/InvalidDateError.ts";
import { motorcycle } from "../../fixtures/MotorcycleFixtures.ts";

Deno.test("Shoud return an appointment entity", () => {
  const date = new Date(2030, 1, 1);

  if (date instanceof Error) {
    throw date;
  }

  const description = "Maintenance description";
  const cost = 100;

  const result = MaintenanceEntity.create({ date, description, motorcycle, cost });

  expect(result.date.toISOString()).toStrictEqual(
    new Date(2030, 1, 1).toISOString(),
  );
  expect(result.description).toStrictEqual("Maintenance description");
  expect(result.cost).toStrictEqual(100);
  expect(result.motorcycle.brand.value).toStrictEqual("Triumph");
  expect(result.motorcycle.model.value).toStrictEqual("Street Triple");
  expect(result.motorcycle.year).toStrictEqual(2024);
});

Deno.test("Should throw error for invalid maintenance entity data", () => {
  const date = new Date(2010, 1, 1);
  if (!(date instanceof Error)) {
    throw new InvalidDateError("Invalid date");
  }

  const brand = Brand.from("");
  if (!(brand instanceof Error)) {
    throw new Error("Invalid brand");
  }

  const model = Model.from("");
  if (!(model instanceof Error)) {
    throw new Error("Invalid model");
  }

  const description = "";
  const cost = -50;

  expect(() => {
    MaintenanceEntity.create({
      date: date as never,
      description,
      motorcycle,
      cost
    });
  }).toThrow();
});
