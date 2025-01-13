import { expect } from "jsr:@std/expect";
import { CreateMotoUsecase } from "../../../../application/usecases/CreateMotoUsecase.ts";
import { MotoRepositoryInMemory } from "../../../adapters/repositories/MotoRepositoryInMemory.ts";
import { MotoEntity } from "../../../../domain/entities/MotoEntity.ts";
import { MotoNotFoundError } from "../../../../domain/errors/MotoNotFoundError.ts";

const motoRepository = new MotoRepositoryInMemory([]);

Deno.test("Should return an error if the model is empty", async () => {
  const createMotoUsecase = new CreateMotoUsecase(motoRepository);
  const model = ""; // Invalid model
  const registrationNumber = "ABC123";
  const status = "active";
  const partId = "valid-part-id";

  const result = await createMotoUsecase.execute(model, registrationNumber, status, partId);

  expect(result).not.toBeUndefined();
});

Deno.test("Should return an error if the registration number is empty", async () => {
  const createMotoUsecase = new CreateMotoUsecase(motoRepository);
  const model = "Model X";
  const registrationNumber = ""; // Invalid registration number
  const status = "active";
  const partId = "valid-part-id";

  const result = await createMotoUsecase.execute(model, registrationNumber, status, partId);

  expect(result).not.toBeUndefined();
});

Deno.test("Should succeed when creating a moto correctly", async () => {
  const createMotoUsecase = new CreateMotoUsecase(motoRepository);
  const model = "Model X";
  const registrationNumber = "ABC123";
  const status = "active";
  const partId = "valid-part-id";

  const result = await createMotoUsecase.execute(model, registrationNumber, status, partId);
  const motos = await motoRepository.all();

  expect(result).toBeUndefined();
  expect(motos.length).toStrictEqual(1);
  expect(motos[0].model).toStrictEqual(model);
  expect(motos[0].registrationNumber).toStrictEqual(registrationNumber);
  expect(motos[0].status).toStrictEqual(status);
});
