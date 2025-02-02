import { expect } from "jsr:@std/expect";
import { UpdateMaintenanceUsecase } from "../../../../../application/usecases/maintenance/UpdateMaintenanceUsecase.ts";
import { MaintenanceRepositoryInMemory } from "../../../../adapters/repositories/MaintenanceRepositoryInMemory.ts";
import { MaintenanceEntity } from "../../../../../domain/entities/MaintenanceEntity.ts";
import { MotorcycleEntity } from "../../../../../domain/entities/MotorcycleEntity.ts";
import { Brand } from "../../../../../domain/value-objects/Brand.ts";
import { Model } from "../../../../../domain/value-objects/Model.ts";
import { MaintenanceNotFoundError } from "../../../../../domain/errors/MaintenanceNotFoundError.ts";

Deno.test("Should update a maintenance successfully when it exists", async () => {
  const brand = Brand.from("Suzuki");
  const model = Model.from("GSX-R1000");

  if (brand instanceof Error) {
    throw new Error("Failed to initialize a new brand");
  }

  if (model instanceof Error) {
    throw new Error("Failed to initialize a new model");
  }

  const motorcycle = MotorcycleEntity.create({brand, model, year: 2024});

  const existingMaintenance = MaintenanceEntity.create({
    date: new Date(2023, 6, 15),
    description: "Changement d'huile moteur",
    motorcycle,
    cost: 750
  });

  const maintenanceRepository = new MaintenanceRepositoryInMemory([existingMaintenance]);
  const updateMaintenanceUsecase = new UpdateMaintenanceUsecase(maintenanceRepository);

  const updatedMaintenance = { ...existingMaintenance, description: "Description mise à jour" };

  const result = await updateMaintenanceUsecase.execute(updatedMaintenance);

  const maintenances = await maintenanceRepository.findAll();

  expect(result).toBeUndefined();
  expect(maintenances.length).toStrictEqual(1);
  expect(maintenances[0].description).toStrictEqual("Description mise à jour");
});

Deno.test("Should return an error when the maintenance does not exist", async () => {
  const maintenanceRepository = new MaintenanceRepositoryInMemory([]);
  const updateMaintenanceUsecase = new UpdateMaintenanceUsecase(maintenanceRepository);

  const brand = Brand.from("Yamaha");
  const model = Model.from("YZF-R1");

  if (brand instanceof Error) {
    throw new Error("Failed to initialize a new brand");
  }

  if (model instanceof Error) {
    throw new Error("Failed to initialize a new model");
  }

  const motorcycle = MotorcycleEntity.create({brand, model, year: 2024});

  const nonExistingMaintenance = MaintenanceEntity.create({
    date: new Date(2024, 5, 30),
    description: "Remplacement des plaquettes de frein",
    motorcycle,
    cost: 1000
  });

  const result = await updateMaintenanceUsecase.execute(nonExistingMaintenance);

  expect(result).toBeInstanceOf(MaintenanceNotFoundError);
});
