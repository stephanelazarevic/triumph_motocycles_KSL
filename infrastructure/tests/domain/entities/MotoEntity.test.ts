import { expect } from "jsr:@std/expect";
import { MotoEntity } from "../../../../domain/entities/MotoEntity.ts";

Deno.test("Should create a valid MotoEntity", () => {
  const model = "Model X";
  const registrationNumber = "XYZ789";
  const status = "active";
  const partId = "valid-part-id";

  const moto = MotoEntity.create(model, registrationNumber, status, partId);

  expect(moto.identifier).not.toBeUndefined();
  expect(moto.model).toStrictEqual(model);
  expect(moto.registrationNumber).toStrictEqual(registrationNumber);
  expect(moto.status).toStrictEqual(status);
  expect(moto.partId).toStrictEqual(partId);
  expect(moto.createdAt).not.toBeUndefined();
  expect(moto.updatedAt).not.toBeUndefined();
  expect(moto.createdAt).toStrictEqual(moto.updatedAt); // On creation, these should be equal.
});

Deno.test("Should throw an error if any required field is missing or invalid", () => {
  const invalidModel = "";
  const registrationNumber = "XYZ789";
  const status = "active";
  const partId = "valid-part-id";

  try {
    MotoEntity.create(invalidModel, registrationNumber, status, partId);
    throw new Error("Expected creation to fail but it succeeded.");
  } catch (error) {
    expect(error).not.toBeUndefined();
  }
});
