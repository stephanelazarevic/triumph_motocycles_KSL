import { MotorcycleRepository } from "../../repositories/MotorcycleRepository.ts";
import { MotorcycleEntity } from "../../../domain/entities/MotorcycleEntity.ts";
import { UpdateMotorcycleCommand } from "../../../domain/types/MotorcycleType.ts";
import { Brand } from "../../../domain/value-objects/Brand.ts";
import { Model } from "../../../domain/value-objects/Model.ts";
import { MotorcycleCannotAssignClientToAlreadyAssignedDriverError } from '../../../domain/errors/MotorcycleCannotAssignClientToAlreadyAssignedDriverError.ts'
import { MotorcycleCannotAssignDriverToAlreadyAssignedClientError } from '../../../domain/errors/MotorcycleCannotAssignDriverToAlreadyAssignedClientError.ts'
import { MotorcycleCannotAssignEnterpriseToAlreadyAssignedClientError } from '../../../domain/errors/MotorcycleCannotAssignEnterpriseToAlreadyAssignedClientError.ts'
import { MotorcycleWithDriversMustBeAssignedToEnterpriseError } from '../../../domain/errors/MotorcycleWithDriversMustBeAssignedToEnterpriseError.ts'
import { MotorcycleCannotAssignClientToAlreadyAssignedEnterpriseError } from '../../../domain/errors/MotorcycleCannotAssignClientToAlreadyAssignedEnterpriseError.ts'
import { MotorcycleHistoryRepository } from "../../repositories/MotorcycleHistoryRepository.ts";
import { AddMotorcycleHistoryUsecase } from "../motorcycleHistory/AddMotorcycleHistoryUsecase.ts";

export class UpdateMotorcycleUsecase {
 constructor(
  private motorcycleRepository: MotorcycleRepository,
  private motorcycleHistoryRepository: MotorcycleHistoryRepository,
  private addMotorcycleHistoryUsecase: AddMotorcycleHistoryUsecase
) {}

 public async execute(motorcycleId: string, command: UpdateMotorcycleCommand): Promise<MotorcycleEntity | Error> {
  const motorcycle = await this.motorcycleRepository.findOneById(motorcycleId);
  if (motorcycle instanceof Error) {
    return motorcycle;
  }

  if (command.dealerId) {
    motorcycle.dealerId = command.dealerId;
  }
    if (command.brand) {
    const brand = Brand.from(command.brand);
    if(brand instanceof Error){
      return brand;
    }
    motorcycle.brand = brand;
  }
  if (command.model) {
    const model = Model.from(command.model);
    if(model instanceof Error){
      return model;
    }
    motorcycle.model = model;
  }
  if (command.year) {
    motorcycle.year = command.year;
  }
  if (command.registrationNumber) {
    motorcycle.registrationNumber = command.registrationNumber;
  }
  if (command.status) {
    motorcycle.status = command.status;
  }
  if (command.clientId) {
    if (MotorcycleEntity.isAssignedToDrivers(motorcycle.drivers)) {
      return new MotorcycleCannotAssignClientToAlreadyAssignedDriverError();
    }
    if (MotorcycleEntity.isAssignedToEntreprise(motorcycle.enterpriseId)) {
      return new MotorcycleCannotAssignClientToAlreadyAssignedEnterpriseError();
    }
    motorcycle.clientId = command.clientId;
  }
  if (command.drivers) {
    if (MotorcycleEntity.isAssignedToClient(motorcycle.clientId)) {
      return new MotorcycleCannotAssignDriverToAlreadyAssignedClientError();
    }
    if (!MotorcycleEntity.isAssignedToEntreprise(motorcycle.enterpriseId)) {
      return new MotorcycleWithDriversMustBeAssignedToEnterpriseError();
    }
    motorcycle.drivers = command.drivers;
  }
  if (command.enterpriseId) {
    if (MotorcycleEntity.isAssignedToClient(motorcycle.clientId)) {
      return new MotorcycleCannotAssignEnterpriseToAlreadyAssignedClientError();
    }
    motorcycle.enterpriseId = command.enterpriseId;
  }

  motorcycle.markAsUpdated();
  await this.motorcycleRepository.save(motorcycle);

  const lastHistory = await this.motorcycleHistoryRepository.findLastByMotorcycleId(motorcycleId);
  if (lastHistory instanceof Error) {
    return lastHistory;
  } else if (lastHistory && lastHistory.endDate === null) {
    lastHistory.endDate = new Date();
    await this.motorcycleHistoryRepository.save(lastHistory);
  }

  const historyCommand = {
    motorcycleId: motorcycle.id,
    startDate: new Date(),
    endDate: null,
    incidents: [],
    maintenances: [],
    clientId: command.clientId ?? null,
    drivers: command.drivers ?? null,
    enterpriseId: command.enterpriseId ?? null
  };

  await this.addMotorcycleHistoryUsecase.execute(historyCommand);

  return motorcycle;
 }
}
