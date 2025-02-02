import { expect } from "jsr:@std/expect";
import { FindAllMaintenancesUsecase } from "../../../../../application/usecases/maintenance/FindAllMaintenancesUsecase.ts";
import { MaintenanceRepositoryInMemory } from "../../../../adapters/repositories/MaintenanceRepositoryInMemory.ts";
import { MaintenanceEntity } from "../../../../../domain/entities/MaintenanceEntity.ts";
import { InvalidDateError } from "../../../../../domain/errors/InvalidDateError.ts";
import { motorcycle } from "../../../../../infrastructure/tests/fixtures/MotorcycleFixtures.ts"

const date = new Date(2030, 1, 1);
const description = "Maintenance description";
const cost = 100;

if (date instanceof Error) {
  throw new InvalidDateError("Invalid date");
}

Deno.test("Should return all maintenances", async () => {
  const maintenance = MaintenanceEntity.create({
    date,
    description,
    motorcycle,
    cost,
  });
  const maintenanceRepository = new MaintenanceRepositoryInMemory([
    maintenance,
  ]);

  const findAllMaintenancesUsecase = new FindAllMaintenancesUsecase(
    maintenanceRepository,
  );
  const result = await findAllMaintenancesUsecase.execute();

  expect(result.length).toStrictEqual(1);

  if (result.length > 0) {
    expect(result[0].description).toStrictEqual("Maintenance description");
  }
});

Deno.test(
  "Should return an empty list when no maintenances exist",
  async () => {
    const maintenanceRepository = new MaintenanceRepositoryInMemory([]);
    const findAllMaintenancesUsecase = new FindAllMaintenancesUsecase(
      maintenanceRepository,
    );

    const result = await findAllMaintenancesUsecase.execute();

    expect(result).toStrictEqual([]);
  },
);
