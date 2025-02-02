import { expect } from "jsr:@std/expect";
import { Brand } from "../../../../domain/value-objects/Brand.ts";
import { Model } from "../../../../domain/value-objects/Model.ts";
import { MotorcycleEntity } from "../../../../domain/entities/MotorcycleEntity.ts";
import { MotorcycleStatus } from "../../../../domain/enum/MotorcycleEnum.ts";

Deno.test("Shoud return a motorcycle entity", () => {
  const dealerIdentifier = "dealer-identifier";
  const registrationNumber = 1234;
  const status = MotorcycleStatus.AVAILABLE;
  const clientIdentifier = "client-identifier";
  
  const brand = Brand.from("Triumph");

  if (brand instanceof Error) {
    throw brand;
  }

  const model = Model.from("Street Triple");

  if (model instanceof Error) {
    throw model;
  }

  const year = 2024;

  const result = MotorcycleEntity.create(dealerIdentifier, brand, model, year, registrationNumber, status, clientIdentifier);

  expect(result.dealerIdentifier).toStrictEqual("dealer-identifier");
  expect(result.brand.value).toStrictEqual("Triumph");
  expect(result.model.value).toStrictEqual("Street Triple");
  expect(result.year).toStrictEqual(2024);
  expect(registrationNumber).toStrictEqual(1234);
  expect(result.status).toStrictEqual(MotorcycleStatus.AVAILABLE);
  expect(result.clientIdentifier).toStrictEqual("client-identifier");
});

Deno.test("Should throw error for invalid motorcycle entity data", () => {
  const dealerIdentifier = "dealer-identifier";
  const registrationNumber = 1234;
  const status = MotorcycleStatus.AVAILABLE;
  const clientIdentifier = "client-identifier";

  const brand = Brand.from("");
  if (!(brand instanceof Error)) {
    throw new Error("Invalid brand");
  }

  const model = Model.from("");
  if (!(model instanceof Error)) {
    throw new Error("Invalid model");
  }

  expect(() => {
    MotorcycleEntity.create(dealerIdentifier, brand as never, model as never, 2024, registrationNumber, status, clientIdentifier);
  }).toThrow();
});
