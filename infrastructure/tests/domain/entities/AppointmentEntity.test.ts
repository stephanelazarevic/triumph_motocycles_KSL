import { expect } from "jsr:@std/expect";
import { AppointmentDate } from "../../../../domain/types/AppointmentDate.ts";
import { Brand } from "../../../../domain/types/Brand.ts";
import { Model } from "../../../../domain/types/Model.ts";
import { MotorcycleEntity } from "../../../../domain/entities/MotorcycleEntity.ts";
import { AppointmentEntity } from "../../../../domain/entities/AppointmentEntity.ts";

Deno.test("Shoud return an appointment entity", () => {
  const date = AppointmentDate.from(new Date(2030, 1, 1));

  if (date instanceof Error) {
    throw date;
  }

  const brand = Brand.from("Triumph");

  if (brand instanceof Error) {
    throw brand;
  }

  const model = Model.from("Street Triple");

  if (model instanceof Error) {
    throw model;
  }

  const year = 2024;

  const motorcycle = MotorcycleEntity.create(brand, model, year);
  const result = AppointmentEntity.create(date, motorcycle);

  expect(result.motorcycle.brand.value).toStrictEqual("Triumph");
  expect(result.motorcycle.model.value).toStrictEqual("Street Triple");
  expect(result.motorcycle.year).toStrictEqual(2024);
  expect(result.date.value.toISOString()).toStrictEqual(new Date(2030, 1, 1).toISOString());
});
