import { expect } from "jsr:@std/expect";
import { Brand } from "../../../../domain/types/Brand.ts";
import { Model } from "../../../../domain/types/Model.ts";
import { MotorcycleEntity } from "../../../../domain/entities/MotorcycleEntity.ts";
import { BreakdownEntity, BreakdownType } from "../../../../domain/entities/BreakdownEntity.ts";

Deno.test("Shoud return a breakdown entity", () => {
  const brand = Brand.from("Triumph");
  
    if (brand instanceof Error) {
      throw brand;
    }
  
    const model = Model.from("Street Triple");
  
    if (model instanceof Error) {
      throw model;
    }
  
    const year = 2024;
    const description = "Breakdown description";
    const motorcycle = MotorcycleEntity.create(brand, model, year);
    const type = BreakdownType.ACCIDENT;
    const reportDate = new Date(2019, 1, 1);
    const resolutionDate = new Date(2020, 2, 1);
    const status = "Resolved";
    
    const result = BreakdownEntity.create(description, motorcycle, type, reportDate, resolutionDate, status);
  
    expect(result.description).toStrictEqual("Breakdown description"); 
    expect(result.motorcycle.brand.value).toStrictEqual("Triumph");
    expect(result.motorcycle.model.value).toStrictEqual("Street Triple");
    expect(result.motorcycle.year).toStrictEqual(2024);
    expect(result.reportDate.toISOString()).toStrictEqual(new Date(2019, 1, 1).toISOString());
    expect(result.type).toStrictEqual(BreakdownType.ACCIDENT);
    expect(result.resolutionDate.toISOString()).toStrictEqual(new Date(2020, 2, 1).toISOString());
    expect(result.status).toStrictEqual("Resolved");
});

Deno.test("Should throw error for invalid breakdown entity data", () => {
  const brand = Brand.from("");
  if (!(brand instanceof Error)) {
    throw new Error("Invalid brand");
  }

  const model = Model.from(""); 
  if (!(model instanceof Error)) {
    throw new Error("Invalid model");
  }

  const motorcycle = MotorcycleEntity.create(brand as never, model as never, 2024);

  const description = "";
  const type = BreakdownType.ACCIDENT;
  const reportDate = new Date(2019, 1, 1);
  const resolutionDate = new Date(2020, 2, 1);
  const status = "";

  expect(() => {
    BreakdownEntity.create(description, motorcycle, type, reportDate as never, resolutionDate as never, status);
  }).toThrow();
});
