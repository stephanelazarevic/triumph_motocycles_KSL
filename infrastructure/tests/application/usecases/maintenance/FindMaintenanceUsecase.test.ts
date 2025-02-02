import { expect } from "jsr:@std/expect";
import { FindMaintenanceUsecase } from "../../../../../application/usecases/maintenance/FindMaintenanceUsecase.ts";
import { MaintenanceRepositoryInMemory } from "../../../../adapters/repositories/MaintenanceRepositoryInMemory.ts";
import { MaintenanceEntity } from "../../../../../domain/entities/MaintenanceEntity.ts";
import { MaintenanceNotFoundError } from "../../../../../domain/errors/MaintenanceNotFoundError.ts";
import { motorcycle } from "../../../../../infrastructure/tests/fixtures/MotorcycleFixtures.ts"

Deno.test("Should find a maintenance successfully when it exists", async () => {

  const maintenance = MaintenanceEntity.create(
    new Date(2023, 5, 20),
    "Remplacement des plaquettes de frein",
    motorcycle,
    1000,
  );

  const maintenanceRepository = new MaintenanceRepositoryInMemory([maintenance]);
  const findMaintenanceUsecase = new FindMaintenanceUsecase(maintenanceRepository);

  const result = await findMaintenanceUsecase.execute(maintenance.id);

  expect(result).not.toBeInstanceOf(MaintenanceNotFoundError);
  expect(result).toStrictEqual(maintenance);
});

Deno.test("Should return an error when the maintenance does not exist", async () => {
  const maintenanceRepository = new MaintenanceRepositoryInMemory([]);
  const findMaintenanceUsecase = new FindMaintenanceUsecase(maintenanceRepository);

  const badId = "badId";
  const result = await findMaintenanceUsecase.execute(badId);

  expect(result).toBeInstanceOf(MaintenanceNotFoundError);
});
