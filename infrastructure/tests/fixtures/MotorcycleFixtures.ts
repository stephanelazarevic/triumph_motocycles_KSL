import { MotorcycleEntity } from "../../../domain/entities/MotorcycleEntity";
import { MotorcycleStatus } from "../../../domain/enum/MotorcycleEnum";
import { Brand } from "../../../domain/value-objects/Brand";
import { Model } from "../../../domain/value-objects/Model";

const dealerIdentifier = "dealer-identifier";
const brand = Brand.from("Triumph");
const model = Model.from("Street Triple");
const year = 2024;
const registrationNumber = 1234;
const motorcycleStatus = MotorcycleStatus.AVAILABLE;
const clientIdentifier = "client-identifier";

if (brand instanceof Error) {
    throw new Error("Failed to initialize a new brand");
}
  
if (model instanceof Error) {
    throw new Error("Failed to initialize a new model");
}

export const motorcycle = MotorcycleEntity.create(dealerIdentifier, brand, model, year, registrationNumber, motorcycleStatus, clientIdentifier)
