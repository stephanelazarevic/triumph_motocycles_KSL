import { PartRepository } from "../../repositories/PartRepository.ts";
import { DealerRepository } from "../../repositories/DealerRepository.ts";
import { UpdatePartCommand } from "../../../domain/types/PartType.ts";
import { PartEntity } from "../../../domain/entities/PartEntity.ts";

export class UpdatePartUsecase {
 constructor(
   private partRepository: PartRepository,
   private dealerRepository: DealerRepository
 ) {}

 public async execute(partId: string, command: UpdatePartCommand): Promise<PartEntity | Error> {
   const part = await this.partRepository.findOneById(partId);
   if (part instanceof Error) {
     return part;
   }

   if (command.dealerId) {
     const dealer = await this.dealerRepository.findOneById(command.dealerId);
     if (dealer instanceof Error) {
       return dealer;
     }
     part.dealer = dealer;
   }

   if (command.reference) {
     part.reference = command.reference;
   }
   if (command.type) {
     part.type = command.type;
   }
   if (command.price) {
     part.price = command.price;
   }
   if (command.stockQuantity) {
     part.stockQuantity = command.stockQuantity;
   }

   part.markAsUpdated();
   await this.partRepository.save(part);
   return part;
 }
}
