import { MotorcycleHistoryRepository } from "../../repositories/MotorcycleHistoryRepository.ts";
import { MotorcycleHistoryEntity } from "../../../domain/entities/MotorcycleHistoryEntity.ts";
import { MotorcycleEntity } from "../../../domain/entities/MotorcycleEntity.ts";
import { UpdateMotorcycleHistoryCommand } from "../../../domain/types/MotorcycleHistoryType.ts";
import { MotorcycleCannotAssignClientToAlreadyAssignedDriverError } from '../../../domain/errors/MotorcycleCannotAssignClientToAlreadyAssignedDriverError.ts'
import { MotorcycleCannotAssignDriverToAlreadyAssignedClientError } from '../../../domain/errors/MotorcycleCannotAssignDriverToAlreadyAssignedClientError.ts'
import { MotorcycleCannotAssignEnterpriseToAlreadyAssignedClientError } from '../../../domain/errors/MotorcycleCannotAssignEnterpriseToAlreadyAssignedClientError.ts'
import { MotorcycleWithDriversMustBeAssignedToEnterpriseError } from '../../../domain/errors/MotorcycleWithDriversMustBeAssignedToEnterpriseError.ts'
import { MotorcycleCannotAssignClientToAlreadyAssignedEnterpriseError } from '../../../domain/errors/MotorcycleCannotAssignClientToAlreadyAssignedEnterpriseError.ts'

export class UpdateMotorcycleHistoryUsecase {
 constructor(
  private motorcycleHistoryRepository: MotorcycleHistoryRepository,
) {}

 public async execute(motorcycleId: string, command: UpdateMotorcycleHistoryCommand): Promise<MotorcycleHistoryEntity | Error> {
   const motorcycleHistory = await this.motorcycleHistoryRepository.findOneById(motorcycleId);
   if (motorcycleHistory instanceof Error) {
     return motorcycleHistory;
   }

   if (command.motorcycleId) {
    motorcycleHistory.motorcycleId = command.motorcycleId;
    }
   if (command.startDate) {
     motorcycleHistory.startDate = command.startDate;
   }
   if (command.endDate) {
     motorcycleHistory.endDate = command.endDate;
   }
   if (command.incidents) {
     motorcycleHistory.incidents = command.incidents;
   }
   if (command.maintenances) {
    motorcycleHistory.maintenances = command.maintenances;
  }
   if (command.clientId) {
    if (MotorcycleEntity.isAssignedToDrivers(motorcycleHistory.drivers)) {
      return new MotorcycleCannotAssignClientToAlreadyAssignedDriverError();
    }
    if (MotorcycleEntity.isAssignedToEntreprise(motorcycleHistory.enterpriseId)) {
      return new MotorcycleCannotAssignClientToAlreadyAssignedEnterpriseError();
    }
    motorcycleHistory.clientId = command.clientId;
   }
   if (command.drivers) {
    if (MotorcycleEntity.isAssignedToClient(motorcycleHistory.clientId)) {
      return new MotorcycleCannotAssignDriverToAlreadyAssignedClientError();
    }
    if (!MotorcycleEntity.isAssignedToEntreprise(motorcycleHistory.enterpriseId)) {
      return new MotorcycleWithDriversMustBeAssignedToEnterpriseError();
    }
    motorcycleHistory.drivers = command.drivers;
   }
   if (command.enterpriseId) {
    if (MotorcycleEntity.isAssignedToClient(motorcycleHistory.clientId)) {
      return new MotorcycleCannotAssignEnterpriseToAlreadyAssignedClientError();
    }
    motorcycleHistory.enterpriseId = command.enterpriseId;
  }

   motorcycleHistory.markAsUpdated();
   await this.motorcycleHistoryRepository.save(motorcycleHistory);
   return motorcycleHistory;
 }
}
