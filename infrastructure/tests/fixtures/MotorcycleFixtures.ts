import { MotorcycleEntity } from "../../../domain/entities/MotorcycleEntity.ts";
import { MotorcycleStatus } from "../../../domain/enum/MotorcycleEnum.ts";
import { Brand } from "../../../domain/value-objects/Brand.ts";
import { Model } from "../../../domain/value-objects/Model.ts";

const dealerId = "dealer-id";
const brand = Brand.from("Triumph");
const model = Model.from("Street Triple");
const year = 2024;
const registrationNumber = 1234;
const status = MotorcycleStatus.AVAILABLE;
const clientId = "client-id";

if (brand instanceof Error) {
    throw new Error("Failed to initialize a new brand");
}

if (model instanceof Error) {
    throw new Error("Failed to initialize a new model");
}

export const motorcycle = MotorcycleEntity.create({
  dealerId,
  brand,
  model,
  year,
  registrationNumber,
  status,
  clientId
}) as MotorcycleEntity;
