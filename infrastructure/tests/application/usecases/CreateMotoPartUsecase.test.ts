import { expect } from "jsr:@std/expect";
import { CreateMotoPartUsecase } from "../../../../application/usecases/CreateMotoPartUsecase.ts";
import { MotoPartRepositoryInMemory } from "../../../adapters/repositories/MotoPartRepositoryInMemory.ts";
import { MotoPartEntity } from "../../../../domain/entities/MotoPartEntity.ts";
import { MotoPartNotFoundError } from "../../../../domain/errors/MotoPartNotFoundError.ts";

const motoPartRepository = new MotoPartRepositoryInMemory([]);

Deno.test("Should return an error if the model is empty", async () => {
  const createMotoPartUsecase = new CreateMotoPartUsecase(motoPartRepository);
  const clientId = "valid-client-id";
  const dealerId = "valid-dealer-id";
  const model = ""; // Invalid model
  const registrationNumber = "XYZ789";
  const status = "active";

  const result = await createMotoPartUsecase.execute(clientId, dealerId, model, registrationNumber, status);

  expect(result).not.toBeUndefined();
});

Deno.test("Should return an error if the registration number is empty", async () => {
  const createMotoPartUsecase = new CreateMotoPartUsecase(motoPartRepository);
  const clientId = "valid-client-id";
  const dealerId = "valid-dealer-id";
  const model = "Model Y";
  const registrationNumber = ""; // Invalid registration number
  const status = "active";

  const result = await createMotoPartUsecase.execute(clientId, dealerId, model, registrationNumber, status);

  expect(result).not.toBeUndefined();
});

Deno.test("Should succeed when creating a moto part correctly", async () => {
  const createMotoPartUsecase = new CreateMotoPartUsecase(motoPartRepository);
  const clientId = "valid-client-id";
  const dealerId = "valid-dealer-id";
  const model = "Model Y";
  const registrationNumber = "XYZ789";
  const status = "inactive";

  const result = await createMotoPartUsecase.execute(clientId, dealerId, model, registrationNumber, status);
  const motoParts = await motoPartRepository.all();

  expect(result).toBeUndefined();
  expect(motoParts.length).toStrictEqual(1);
  expect(motoParts[0].model).toStrictEqual(model);
  expect(motoParts[0].registrationNumber).toStrictEqual(registrationNumber);
  expect(motoParts[0].status).toStrictEqual(status);
});
