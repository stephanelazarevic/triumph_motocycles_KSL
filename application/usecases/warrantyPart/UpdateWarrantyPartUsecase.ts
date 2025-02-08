import { WarrantyPartRepository } from "../../repositories/WarrantyPartRepository.ts";
import { WarrantyRepository } from "../../repositories/WarrantyRepository.ts";
import { PartRepository } from "../../repositories/PartRepository.ts";
import { WarrantyPartEntity } from "../../../domain/entities/WarrantyPartEntity.ts";
import { UpdateWarrantyPartCommand } from "../../../domain/types/WarrantyPartType.ts";

export class UpdateWarrantyPartUsecase {
 constructor(
   private readonly warrantyPartRepository: WarrantyPartRepository,
   private readonly warrantyRepository: WarrantyRepository,
   private readonly partRepository: PartRepository,
 ) {}

 public async execute(warrantyPartId: string, command: UpdateWarrantyPartCommand): Promise<WarrantyPartEntity | Error> {
   const warrantyPart = await this.warrantyPartRepository.findOneById(warrantyPartId);
   if (warrantyPart instanceof Error) {
     return warrantyPart;
   }

   if (command.warrantyId) {
     const warranty = await this.warrantyRepository.findOneById(command.warrantyId);
     if (warranty instanceof Error) {
       return warranty;
     }
     warrantyPart.warranty = warranty;
   }

   if (command.partId) {
    const part = await this.partRepository.findOneById(command.partId);
    if (part instanceof Error) {
      return part;
    }
    warrantyPart.part = part;
  }

   if (command.coveredCost) {
     warrantyPart.coveredCost = command.coveredCost;
   }
   if (command.remainingCost) {
     warrantyPart.remainingCost = command.remainingCost;
   }

   warrantyPart.markAsUpdated();
   await this.warrantyPartRepository.save(warrantyPart);
   return warrantyPart;
 }
}
