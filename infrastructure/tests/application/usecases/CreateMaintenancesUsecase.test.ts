import { expect } from "jsr:@std/expect";
import { CreateMaintenanceUsecase } from "../../../../application/usecases/CreateMaintenanceUsecase.ts";
import { MaintenanceRepositoryInMemory } from "../../../adapters/repositories/MaintenanceRepositoryInMemory.ts";
import { MotorcycleRepositoryInMemory } from "../../../adapters/repositories/MotorcycleRepositoryInMemory.ts";
import { MotorcycleEntity } from "../../../../domain/entities/MotorcycleEntity.ts";
import { Brand } from "../../../../domain/types/Brand.ts";
import { Model } from "../../../../domain/types/Model.ts";

const maintenanceRepository = new MaintenanceRepositoryInMemory([]);
const brand = Brand.from("Triumph");
const model = Model.from("Street Triple");

if (brand instanceof Error) {
  throw new Error("Failed to initialize a new brand");
}

if (model instanceof Error) {
  throw new Error("Failed to initialize a new model");
}

const motorcycle = MotorcycleEntity.create(brand, model, 2024);

const motorcycleRepository = new MotorcycleRepositoryInMemory([
  motorcycle,
]);

Deno.test("Should return an error if the date is in the past when createing a maintenance", async () => {
  const createMaintenanceUsecase = new CreateMaintenanceUsecase(maintenanceRepository, motorcycleRepository);
  const today = new Date();
  const date = new Date(today.getFullYear() - 1, 1, 1);
  const cost = 100;
  const result = await createMaintenanceUsecase.execute(date, motorcycle.identifier, cost);

  expect(result).not.toBeUndefined();
});

Deno.test("Should return an error if the motorcycle does not exist", async () => {
  const createMaintenanceUsecase = new CreateMaintenanceUsecase(maintenanceRepository, motorcycleRepository);
  const today = new Date();
  const date = new Date(today.getFullYear() + 1, 1, 1);
  const cost = 100;
  const result = await createMaintenanceUsecase.execute(date, "", cost);

  expect(result).not.toBeUndefined();
});

Deno.test("Should return an error if the cost is null", async () => {
    const createMaintenanceUsecase = new CreateMaintenanceUsecase(maintenanceRepository, motorcycleRepository);
    const today = new Date();
    const date = new Date(today.getFullYear() + 1, 1, 1);
    const cost = 100;
    const result = await createMaintenanceUsecase.execute(date, motorcycle.identifier, 0);
  
    expect(result).not.toBeUndefined();
  });

Deno.test("Should succeed when creating an appointment correctly", async () => {
  const createMaintenanceUsecase = new CreateMaintenanceUsecase(maintenanceRepository, motorcycleRepository);
  const today = new Date();
  const date = new Date(today.getFullYear() + 1, 1, 1);
  const cost = 100;
  const result = await createMaintenanceUsecase.execute(date, motorcycle.identifier, cost);
  const maintenances = await maintenanceRepository.all();

  expect(result).toBeUndefined();
  expect(maintenances.length).toStrictEqual(1);
});
