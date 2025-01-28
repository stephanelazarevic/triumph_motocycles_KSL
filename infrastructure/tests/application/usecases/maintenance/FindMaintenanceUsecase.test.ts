import { expect } from "jsr:@std/expect";
import { FindMaintenanceUsecase } from "../../../../../application/usecases/maintenance/FindMaintenanceUsecase.ts";
import { MaintenanceRepositoryInMemory } from "../../../../adapters/repositories/MaintenanceRepositoryInMemory.ts";
import { MaintenanceEntity } from "../../../../../domain/entities/MaintenanceEntity.ts";
import { MotorcycleEntity } from "../../../../../domain/entities/MotorcycleEntity.ts";
import { Brand } from "../../../../../domain/types/Brand.ts";
import { Model } from "../../../../../domain/types/Model.ts";
import { MaintenanceNotFoundError } from "../../../../../domain/errors/MaintenanceNotFoundError.ts";

Deno.test("Should find a maintenance successfully when it exists", async () => {
  const brand = Brand.from("Yamaha");
  const model = Model.from("MT-07");

  if (brand instanceof Error) {
    throw new Error("Failed to initialize a new brand");
  }

  if (model instanceof Error) {
    throw new Error("Failed to initialize a new model");
  }

  const motorcycle = MotorcycleEntity.create(brand, model, 2022);

  const maintenance = MaintenanceEntity.create(
    new Date(2023, 5, 20),
    "Remplacement des plaquettes de frein",
    motorcycle,
    1000,
  );

  const maintenanceRepository = new MaintenanceRepositoryInMemory([maintenance]);
  const findMaintenanceUsecase = new FindMaintenanceUsecase(maintenanceRepository);

  const result = await findMaintenanceUsecase.execute(maintenance.identifier);

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
