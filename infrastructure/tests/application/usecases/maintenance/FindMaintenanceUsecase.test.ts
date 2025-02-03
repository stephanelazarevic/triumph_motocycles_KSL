import { expect } from "jsr:@std/expect";
import { GetMaintenanceUsecase } from "../../../../../application/usecases/maintenance/GetMaintenanceUsecase.ts";
import { MaintenanceRepositoryInMemory } from "../../../../adapters/repositories/MaintenanceRepositoryInMemory.ts";
import { MaintenanceEntity } from "../../../../../domain/entities/MaintenanceEntity.ts";
import { MaintenanceNotFoundError } from "../../../../../domain/errors/MaintenanceNotFoundError.ts";
import { motorcycle } from "../../../../../infrastructure/tests/fixtures/MotorcycleFixtures.ts"

Deno.test("Should find a maintenance successfully when it exists", async () => {
  const maintenance = MaintenanceEntity.create({
    date: new Date(2023, 4, 20),
    description: "Remplacement des plaquettes de frein",
    motorcycle,
    cost: 1000
  });

  const maintenanceRepository = new MaintenanceRepositoryInMemory([maintenance]);
  const getMaintenanceUsecase = new GetMaintenanceUsecase(maintenanceRepository);

  const result = await getMaintenanceUsecase.execute(maintenance.id);

  expect(result).not.toBeInstanceOf(MaintenanceNotFoundError);
  expect(result).toStrictEqual(maintenance);
});

Deno.test("Should return an error when the maintenance does not exist", async () => {
  const maintenanceRepository = new MaintenanceRepositoryInMemory([]);
  const getMaintenanceUsecase = new GetMaintenanceUsecase(maintenanceRepository);

  const badId = "badId";
  const result = await getMaintenanceUsecase.execute(badId);

  expect(result).toBeInstanceOf(MaintenanceNotFoundError);
});
