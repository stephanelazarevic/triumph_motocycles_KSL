import { WarrantyRepository } from "../../repositories/WarrantyRepository.ts";
import { MotorcycleRepository } from "../../repositories/MotorcycleRepository.ts";
import { WarrantyEntity } from "../../../domain/entities/WarrantyEntity.ts";
import { UpdateWarrantyCommand } from "../../../domain/types/WarrantyType.ts";

export class UpdateWarrantyUsecase {
 constructor(
   private warrantyRepository: WarrantyRepository,
   private motorcycleRepository: MotorcycleRepository
 ) {}

 public async execute(warrantyId: string, command: UpdateWarrantyCommand): Promise<WarrantyEntity | Error> {
   const warranty = await this.warrantyRepository.findOneById(warrantyId);
   if (warranty instanceof Error) {
     return warranty;
   }

   if (command.motorcycleId) {
     const motorcycle = await this.motorcycleRepository.findOneById(command.motorcycleId);
     if (motorcycle instanceof Error) {
       return motorcycle;
     }
     warranty.motorcycle = motorcycle;
   }

   if (command.startDate) {
     warranty.startDate = command.startDate;
   }
   if (command.endDate) {
     warranty.endDate = command.endDate;
   }
   if (command.type) {
     warranty.type = command.type;
   }
   if (command.terms) {
     warranty.terms = command.terms;
   }

   warranty.markAsUpdated();
   await this.warrantyRepository.save(warranty);
   return warranty;
 }
}
