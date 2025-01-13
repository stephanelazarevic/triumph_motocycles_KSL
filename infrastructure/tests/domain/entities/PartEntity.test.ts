import { expect } from "jsr:@std/expect";
import { PartEntity } from "../../../../domain/entities/PartEntity.ts";

Deno.test("Should create a valid PartEntity", () => {
  const commandIdentifier = "valid-command-id";
  const reference = "PartRef123";
  const type = "Standard";
  const price = 150.75;
  const stockQuantity = 20;

  const part = PartEntity.create(commandIdentifier, reference, type, price, stockQuantity);

  expect(part.identifier).not.toBeUndefined();
  expect(part.commandIdentifier).toStrictEqual(commandIdentifier);
  expect(part.reference).toStrictEqual(reference);
  expect(part.type).toStrictEqual(type);
  expect(part.price).toStrictEqual(price);
  expect(part.stockQuantity).toStrictEqual(stockQuantity);
  expect(part.createdAt).not.toBeUndefined();
  expect(part.updatedAt).not.toBeUndefined();
  expect(part.createdAt).toStrictEqual(part.updatedAt); // On creation, these should be equal.
});

Deno.test("Should throw an error if any required field is missing or invalid", () => {
  const invalidCommandIdentifier = "";
  const reference = "PartRef123";
  const type = "Standard";
  const price = 150.75;
  const stockQuantity = 20;

  try {
    PartEntity.create(invalidCommandIdentifier, reference, type, price, stockQuantity);
    throw new Error("Expected creation to fail but it succeeded.");
  } catch (error) {
    expect(error).not.toBeUndefined();
  }
});
