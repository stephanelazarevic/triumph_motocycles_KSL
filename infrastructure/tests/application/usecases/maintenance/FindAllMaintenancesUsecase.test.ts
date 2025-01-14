import { expect } from "jsr:@std/expect";
import { FindAllMaintenancesUsecase } from "../../../../../application/usecases/maintenance/FindAllMaintenancesUsecase.ts";
import { MaintenanceRepositoryInMemory } from "../../../../adapters/repositories/MaintenanceRepositoryInMemory.ts";
import { MaintenanceEntity } from "../../../../../domain/entities/MaintenanceEntity.ts";
import { MotorcycleEntity } from "../../../../../domain/entities/MotorcycleEntity.ts";
import { Brand } from "../../../../../domain/types/Brand.ts";
import { Model } from "../../../../../domain/types/Model.ts";
import { AppointmentDate } from "../../../../../domain/types/AppointmentDate.ts";
import { AppointmentDatePastError } from "../../../../../domain/errors/AppointmentDatePastError.ts";
import { EmptyListError } from "../../../../../domain/errors/EmptyListError.ts";

const brand = Brand.from("Triumph");
const model = Model.from("Street Triple");

if (brand instanceof Error) {
    throw new Error("Failed to initialize a new brand");
}

if (model instanceof Error) {
    throw new Error("Failed to initialize a new model");
}
  
const motorcycle = MotorcycleEntity.create(brand, model, 2024);
const date = AppointmentDate.from(new Date(2030, 1, 1));
const description = "Maintenance description";
const cost = 100;

if (date instanceof Error) {
  throw new AppointmentDatePastError("Invalid date");
}

Deno.test("Should return all maintenances", async () => {
    const maintenance = MaintenanceEntity.create(date, description, motorcycle, cost);
    const maintenanceRepository = new MaintenanceRepositoryInMemory([maintenance]);
  
    const findAllMaintenancesUsecase = new FindAllMaintenancesUsecase(maintenanceRepository);
    const result = await findAllMaintenancesUsecase.execute();
  
    if (result instanceof EmptyListError) {
      throw new EmptyListError("This is an EmptyList");
    }
  
    expect(result.length).toStrictEqual(1);
  
    if (result.length > 0) {
        expect(result[0].description).toStrictEqual("Maintenance description");
      }
});

  Deno.test("Should return an error when no maintenances exist", async () => {
    const maintenanceRepository = new MaintenanceRepositoryInMemory([]);
    const findAllMaintenancesUsecase = new FindAllMaintenancesUsecase(maintenanceRepository);
  
    try {
      await findAllMaintenancesUsecase.execute(); 
    } catch (error) {
      expect(error).toBeInstanceOf(EmptyListError);
      expect(error.message).toStrictEqual("The maintenance list is empty");
    }
});
  
