import { expect } from "jsr:@std/expect";
import { DeleteMaintenanceUsecase } from "../../../../../application/usecases/maintenance/DeleteMaintenanceUsecase.ts";
import { MaintenanceRepositoryInMemory } from "../../../../adapters/repositories/MaintenanceRepositoryInMemory.ts";
import { MaintenanceEntity } from "../../../../../domain/entities/MaintenanceEntity.ts";
import { MaintenanceNotFoundError } from "../../../../../domain/errors/MaintenanceNotFoundError.ts";
import { motorcycle } from "../../../../../infrastructure/tests/fixtures/MotorcycleFixtures.ts"

Deno.test("Should delete a maintenance successfully when it exists", async () => {

  const maintenance = MaintenanceEntity.create(
    new Date(2024, 1, 10),
    "Change d'huile moteur",
    motorcycle,
    110.0,
  );

  const maintenanceRepository = new MaintenanceRepositoryInMemory([maintenance]);
  const deleteMaintenanceUsecase = new DeleteMaintenanceUsecase(maintenanceRepository);

  const result = await deleteMaintenanceUsecase.execute(maintenance.identifier);

  const maintenances = await maintenanceRepository.findAll();

  expect(result).toBeUndefined();
  expect(maintenances.length).toStrictEqual(0);
});

Deno.test("Should return an error when the maintenance does not exist", async () => {
  const maintenanceRepository = new MaintenanceRepositoryInMemory([]);
  const deleteMaintenanceUsecase = new DeleteMaintenanceUsecase(maintenanceRepository);

  const badId = "badId";
  const result = await deleteMaintenanceUsecase.execute(badId);

  expect(result).toBeInstanceOf(MaintenanceNotFoundError);
});
