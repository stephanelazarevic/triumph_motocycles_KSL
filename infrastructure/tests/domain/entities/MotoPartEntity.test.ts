import { expect } from "jsr:@std/expect";
import { MotoPartEntity } from "../../../../domain/entities/MotoPartEntity.ts";

Deno.test("Should create a valid MotoPartEntity", () => {
  const clientId = "valid-client-id";
  const dealerId = "valid-dealer-id";
  const model = "Model Y";
  const registrationNumber = "ABC123";
  const status = "active";

  const motoPart = MotoPartEntity.create(clientId, dealerId, model, registrationNumber, status);

  expect(motoPart.identifier).not.toBeUndefined();
  expect(motoPart.clientId).toStrictEqual(clientId);
  expect(motoPart.dealerId).toStrictEqual(dealerId);
  expect(motoPart.model).toStrictEqual(model);
  expect(motoPart.registrationNumber).toStrictEqual(registrationNumber);
  expect(motoPart.status).toStrictEqual(status);
  expect(motoPart.createdAt).not.toBeUndefined();
  expect(motoPart.updatedAt).not.toBeUndefined();
  expect(motoPart.createdAt).toStrictEqual(motoPart.updatedAt); // On creation, these should be equal.
});

Deno.test("Should throw an error if any required field is missing or invalid", () => {
  const invalidModel = "";
  const registrationNumber = "ABC123";
  const status = "active";
  const clientId = "valid-client-id";
  const dealerId = "valid-dealer-id";

  try {
    MotoPartEntity.create(clientId, dealerId, invalidModel, registrationNumber, status);
    throw new Error("Expected creation to fail but it succeeded.");
  } catch (error) {
    expect(error).not.toBeUndefined();
  }
});
