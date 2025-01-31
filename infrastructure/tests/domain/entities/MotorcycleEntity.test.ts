import { expect } from "jsr:@std/expect";
import { Brand } from "../../../../domain/value-objects/Brand.ts";
import { Model } from "../../../../domain/value-objects/Model.ts";
import { MotorcycleEntity } from "../../../../domain/entities/MotorcycleEntity.ts";

Deno.test("Shoud return a motorcycle entity", () => {
  const brand = Brand.from("Triumph");

  if (brand instanceof Error) {
    throw brand;
  }

  const model = Model.from("Street Triple");

  if (model instanceof Error) {
    throw model;
  }

  const year = 2024;

  const result = MotorcycleEntity.create(brand, model, year);

  expect(result.brand.value).toStrictEqual("Triumph");
  expect(result.model.value).toStrictEqual("Street Triple");
  expect(result.year).toStrictEqual(2024);
});

Deno.test("Should throw error for invalid motorcycle entity data", () => {
  const brand = Brand.from("");
  if (!(brand instanceof Error)) {
    throw new Error("Invalid brand");
  }

  const model = Model.from("");
  if (!(model instanceof Error)) {
    throw new Error("Invalid model");
  }

  expect(() => {
    MotorcycleEntity.create(brand as never, model as never, 2024);
  }).toThrow();
});
