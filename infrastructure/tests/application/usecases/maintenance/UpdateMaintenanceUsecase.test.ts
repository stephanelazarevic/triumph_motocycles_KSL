import { expect } from "jsr:@std/expect";
import { UpdateMaintenanceUsecase } from "../../../../../application/usecases/maintenance/UpdateMaintenanceUsecase.ts";
import { MaintenanceRepositoryInMemory } from "../../../../adapters/repositories/MaintenanceRepositoryInMemory.ts";
import { MaintenanceEntity } from "../../../../../domain/entities/MaintenanceEntity.ts";
import { MaintenanceNotFoundError } from "../../../../../domain/errors/MaintenanceNotFoundError.ts";
import { motorcycle } from "../../../../../infrastructure/tests/fixtures/MotorcycleFixtures.ts"

Deno.test("Should update a maintenance successfully when it exists", async () => {

  const existingMaintenance = MaintenanceEntity.create(
    new Date(2023, 6, 15),
    "Changement d'huile moteur",
    motorcycle,
    750,
  );

  const maintenanceRepository = new MaintenanceRepositoryInMemory([existingMaintenance]);
  const updateMaintenanceUsecase = new UpdateMaintenanceUsecase(maintenanceRepository);

  const updatedMaintenance = { ...existingMaintenance, description: "Description mise à jour" };

  const result = await updateMaintenanceUsecase.execute(existingMaintenance.identifier, updatedMaintenance);

  const maintenances = await maintenanceRepository.findAll();

  expect(result).toBeUndefined();
  expect(maintenances.length).toStrictEqual(1);
  expect(maintenances[0].description).toStrictEqual("Description mise à jour");
});

Deno.test("Should return an error when the maintenance does not exist", async () => {
  const maintenanceRepository = new MaintenanceRepositoryInMemory([]);
  const updateMaintenanceUsecase = new UpdateMaintenanceUsecase(maintenanceRepository);

  const nonExistentMaintenance = MaintenanceEntity.create(
    new Date(2024, 5, 30),
    "Remplacement des plaquettes de frein",
    motorcycle,
    1000,
  );

  const result = await updateMaintenanceUsecase.execute("blabla", nonExistentMaintenance);

  expect(result).toBeInstanceOf(MaintenanceNotFoundError);
});
