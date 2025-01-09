import { expect } from "jsr:@std/expect";
import { CreateAppointmentUsecase } from "../../../../application/usecases/CreateAppointmentUsecase.ts";
import { AppointmentRepositoryInMemory } from "../../../adapters/repositories/AppointmentRepositoryInMemory.ts";
import { MotorcycleRepositoryInMemory } from "../../../adapters/repositories/MotorcycleRepositoryInMemory.ts";
import { MotorcycleEntity } from "../../../../domain/entities/MotorcycleEntity.ts";
import { Brand } from "../../../../domain/types/Brand.ts";
import { Model } from "../../../../domain/types/Model.ts";

const appointmentRepository = new AppointmentRepositoryInMemory([]);
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

Deno.test("Should return an error if the date is in the past when createing an appointment", async () => {
  const createAppointmentUsecase = new CreateAppointmentUsecase(appointmentRepository, motorcycleRepository);
  const today = new Date();
  const date = new Date(today.getFullYear() - 1, 1, 1);
  const result = await createAppointmentUsecase.execute(date, motorcycle.identifier);

  expect(result).not.toBeUndefined();
});

Deno.test("Should return an error if the the motorcycle does not exist", async () => {
  const createAppointmentUsecase = new CreateAppointmentUsecase(appointmentRepository, motorcycleRepository);
  const today = new Date();
  const date = new Date(today.getFullYear() + 1, 1, 1);
  const result = await createAppointmentUsecase.execute(date, "");

  expect(result).not.toBeUndefined();
});

Deno.test("Should succeed when creating an appointment correctly", async () => {
  const createAppointmentUsecase = new CreateAppointmentUsecase(appointmentRepository, motorcycleRepository);
  const today = new Date();
  const date = new Date(today.getFullYear() + 1, 1, 1);
  const result = await createAppointmentUsecase.execute(date, motorcycle.identifier);
  const appointments = await appointmentRepository.all();

  expect(result).toBeUndefined();
  expect(appointments.length).toStrictEqual(1);
});
