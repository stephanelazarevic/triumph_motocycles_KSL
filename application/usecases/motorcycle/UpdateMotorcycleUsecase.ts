import { MotorcycleRepository } from "../../repositories/MotorcycleRepository.ts";
import { DealerRepository } from "../../repositories/DealerRepository.ts";
import { WarrantyRepository } from "../../repositories/WarrantyRepository.ts";
import { MotorcycleEntity } from "../../../domain/entities/MotorcycleEntity.ts";
import { UpdateMotorcycleCommand } from "../../../domain/types/MotorcycleType.ts";
import { Brand } from "../../../domain/value-objects/Brand.ts";
import { Model } from "../../../domain/value-objects/Model.ts";
import { MotorcycleCannotAssignClientToAlreadyAssignedDriverError } from '../../../domain/errors/MotorcycleCannotAssignClientToAlreadyAssignedDriverError.ts'
import { MotorcycleCannotAssignDriverToAlreadyAssignedClientError } from '../../../domain/errors/MotorcycleCannotAssignDriverToAlreadyAssignedClientError.ts'

export class UpdateMotorcycleUsecase {
 constructor(
  private motorcycleRepository: MotorcycleRepository,
  private dealerRepository: DealerRepository,
  private warrantyRepository: WarrantyRepository,
) {}

 public async execute(motorcycleId: string, command: UpdateMotorcycleCommand): Promise<MotorcycleEntity | Error> {
   const motorcycle = await this.motorcycleRepository.findOneById(motorcycleId);
   if (motorcycle instanceof Error) {
     return motorcycle;
   }

   if (command.dealerId) {
    const dealer = await this.dealerRepository.findOneById(command.dealerId);
    if (dealer instanceof Error) {
      return dealer;
    }
    motorcycle.dealer = dealer;
  }
   if (command.warrantyId) {
    const warranty = await this.warrantyRepository.findOneById(command.warrantyId);
    if (warranty instanceof Error) {
      return warranty;
    }
    motorcycle.warranty = warranty;
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
    if(motorcycle.isAssignedToDriver()){
      return new MotorcycleCannotAssignClientToAlreadyAssignedDriverError();
    }
     motorcycle.clientId = command.clientId;
   }
   if (command.driverId) {
    if(motorcycle.isAssignedToClient()){
      return new MotorcycleCannotAssignDriverToAlreadyAssignedClientError();
    }
     motorcycle.driverId = command.driverId;
   }

   motorcycle.markAsUpdated();
   await this.motorcycleRepository.save(motorcycle);
   return motorcycle;
 }
}
