import { expect } from "jsr:@std/expect";
import { Brand } from "../../../../domain/value-objects/Brand.ts";
import { Model } from "../../../../domain/value-objects/Model.ts";
import { MotorcycleEntity } from "../../../../domain/entities/MotorcycleEntity.ts";
import { WarrantyEntity } from "../../../../domain/entities/WarrantyEntity.ts";

Deno.test("Shoud return a warranty entity", () => {
  const brand = Brand.from("Triumph");

  if (brand instanceof Error) {
    throw brand;
  }

  const model = Model.from("Street Triple");

  if (model instanceof Error) {
    throw model;
  }

  const year = 2024;
  const motorcycle = MotorcycleEntity.create({
    brand,
    model,
    year
  });
  const startDate = new Date(2024, 1, 1);
  const endDate = new Date(2030, 1, 1);
  const warrantyType = "Extended";
  const terms = "Terms and conditions";

  const result = WarrantyEntity.create({
    startDate,
    endDate,
    motorcycle,
    warrantyType,
    terms
  });

  expect(result.startDate.toISOString()).toStrictEqual(new Date(2024, 1, 1).toISOString());
  expect(result.endDate.toISOString()).toStrictEqual(new Date(2030, 1, 1).toISOString());
  expect(result.motorcycle.brand.value).toStrictEqual("Triumph");
  expect(result.motorcycle.model.value).toStrictEqual("Street Triple");
  expect(result.motorcycle.year).toStrictEqual(2024);
  expect(result.warrantyType).toStrictEqual("Extended");
  expect(result.terms).toStrictEqual("Terms and conditions");
});

Deno.test("Should throw error for invalid warranty entity data", () => {
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
    model: model as never ,
    year: 2024
  });

  const startDate = new Date(2024, 1, 1);
  const endDate = new Date(2030, 1, 1);
  const warrantyType = "";
  const terms = "";

  expect(() => {
    WarrantyEntity.create({
      startDate: startDate as never,
      endDate: endDate as never,
      motorcycle,
      warrantyType,
      terms
    });
  }).toThrow();
});
