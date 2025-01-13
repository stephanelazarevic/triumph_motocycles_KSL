import { expect } from "jsr:@std/expect";
import { CreatePartUsecase } from "../../../../application/usecases/CreatePartUsecase.ts";
import { PartRepositoryInMemory } from "../../../adapters/repositories/PartRepositoryInMemory.ts";
import { PartEntity } from "../../../../domain/entities/PartEntity.ts";

const partRepository = new PartRepositoryInMemory([]);

Deno.test("Should return an error if the reference is too short", async () => {
  const createPartUsecase = new CreatePartUsecase(partRepository);
  const commandIdentifier = "valid-command-id";
  const reference = "A"; // Invalid reference
  const type = "Standard";
  const price = 100;
  const stockQuantity = 10;

  const result = await createPartUsecase.execute(commandIdentifier, reference, type, price, stockQuantity);

  expect(result).not.toBeUndefined();
});

Deno.test("Should return an error if the price is negative", async () => {
  const createPartUsecase = new CreatePartUsecase(partRepository);
  const commandIdentifier = "valid-command-id";
  const reference = "ValidRef";
  const type = "Standard";
  const price = -50; // Invalid price
  const stockQuantity = 10;

  const result = await createPartUsecase.execute(commandIdentifier, reference, type, price, stockQuantity);

  expect(result).not.toBeUndefined();
});

Deno.test("Should succeed when creating a part correctly", async () => {
  const createPartUsecase = new CreatePartUsecase(partRepository);
  const commandIdentifier = "valid-command-id";
  const reference = "ValidRef";
  const type = "Standard";
  const price = 100;
  const stockQuantity = 10;

  const result = await createPartUsecase.execute(commandIdentifier, reference, type, price, stockQuantity);
  const parts = await partRepository.all();

  expect(result).toBeUndefined();
  expect(parts.length).toStrictEqual(1);
  expect(parts[0].reference).toStrictEqual(reference);
  expect(parts[0].price).toStrictEqual(price);
});
