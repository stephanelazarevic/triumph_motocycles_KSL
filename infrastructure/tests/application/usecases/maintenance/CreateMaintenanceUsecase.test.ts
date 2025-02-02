import { expect } from "jsr:@std/expect";
import { CreateMaintenanceUsecase } from "../../../../../application/usecases/maintenance/CreateMaintenanceUsecase.ts";
import { MaintenanceRepositoryInMemory } from "../../../../adapters/repositories/MaintenanceRepositoryInMemory.ts";
import { MotorcycleRepositoryInMemory } from "../../../../adapters/repositories/MotorcycleRepositoryInMemory.ts";
import { InvalidDateError } from "../../../../../domain/errors/InvalidDateError.ts";
import { MotorcycleNotFoundError } from "../../../../../domain/errors/MotorcycleNotFoundError.ts";
import { NullCostError } from "../../../../../domain/errors/NullCostError.ts";
import { EmptyDescriptionError } from "../../../../../domain/errors/EmptyDescriptionError.ts";
import { motorcycle } from "../../../../../infrastructure/tests/fixtures/MotorcycleFixtures.ts"

const maintenanceRepository = new MaintenanceRepositoryInMemory([]);

const description = "Maintenance description";
const cost = 100;
const date = new Date(2005, 1, 1);

if (date instanceof Error) {
  throw new InvalidDateError("Invalid date");
}

const motorcycleRepository = new MotorcycleRepositoryInMemory([motorcycle]);

Deno.test("Should return an error if the date is invalid", async () => {
  const createMaintenanceUsecase = new CreateMaintenanceUsecase(
    maintenanceRepository,
    motorcycleRepository,
  );
  const badDate = new Date(2006, 1, 1);
  const result = await createMaintenanceUsecase.execute(
    badDate,
    description,
    motorcycle.identifier,
    cost,
  );

  expect(result).toBeInstanceOf(InvalidDateError);
});

Deno.test(
  "Should return an error if the motorcycle does not exist",
  async () => {
    const createMaintenanceUsecase = new CreateMaintenanceUsecase(
      maintenanceRepository,
      motorcycleRepository,
    );
    const result = await createMaintenanceUsecase.execute(
      date,
      description,
      "",
      cost,
    );

    expect(result).toBeInstanceOf(MotorcycleNotFoundError);
  },
);

Deno.test("Should return an error if the cost is null", async () => {
  const createMaintenanceUsecase = new CreateMaintenanceUsecase(
    maintenanceRepository,
    motorcycleRepository,
  );
  const result = await createMaintenanceUsecase.execute(
    date,
    description,
    motorcycle.identifier,
    0,
  );

  expect(result).toBeInstanceOf(NullCostError);
});

Deno.test("Should return an error if the description is empty", async () => {
  const createMaintenanceUsecase = new CreateMaintenanceUsecase(
    maintenanceRepository,
    motorcycleRepository,
  );
  const result = await createMaintenanceUsecase.execute(
    date,
    "",
    motorcycle.identifier,
    cost,
  );

  expect(result).toBeInstanceOf(EmptyDescriptionError);
});

Deno.test("Should succeed when creating an appointment correctly", async () => {
  const createMaintenanceUsecase = new CreateMaintenanceUsecase(
    maintenanceRepository,
    motorcycleRepository,
  );
  const result = await createMaintenanceUsecase.execute(
    date,
    description,
    motorcycle.identifier,
    cost,
  );

  const maintenances = await maintenanceRepository.findAll();

  expect(result).not.toBeInstanceOf(Error);

  expect(maintenances.length).toStrictEqual(1);
  expect(maintenances[0].date).toStrictEqual(date);
  expect(maintenances[0].description).toStrictEqual(description);
  expect(maintenances[0].cost).toStrictEqual(cost);
  expect(maintenances[0].motorcycle).toStrictEqual(motorcycle);
});
