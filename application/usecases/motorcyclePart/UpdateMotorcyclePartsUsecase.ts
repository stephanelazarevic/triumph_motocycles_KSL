import { MotorcyclePartRepository } from "../../repositories/MotorcyclePartRepository.ts";
import { MotorcycleRepository } from "../../repositories/MotorcycleRepository.ts";
import { PartRepository } from "../../repositories/PartRepository.ts";
import { MotorcyclePartEntity } from "../../../domain/entities/MotorcyclePartEntity.ts";
import { UpdateMotorcyclePartCommand } from "../../../domain/types/MotorcyclePartType.ts";

export class UpdateMotorcyclePartsUsecase {
 constructor(
    private motorcyclePartRepository: MotorcyclePartRepository,
    private motorcycleRepository: MotorcycleRepository,
    private partRepository: PartRepository,
 ) {}

 public async execute(motorcyclePartId: string, command: UpdateMotorcyclePartCommand): Promise<MotorcyclePartEntity | Error> {
   const motorcyclePart = await this.motorcyclePartRepository.findOneById(motorcyclePartId);
   if (motorcyclePart instanceof Error) {
     return motorcyclePart;
   }

    if (command.motorcycleId) {
        const motorcycle = await this.motorcycleRepository.findOneById(command.motorcycleId);
        if (motorcycle instanceof Error) {
            return motorcycle;
        }
        motorcyclePart.motorcycle = motorcycle;
    }

    if (command.partId) {
        const part = await this.partRepository.findOneById(command.partId);
        if (part instanceof Error) {
            return part;
        }
        motorcyclePart.part = part;
    }

   motorcyclePart.markAsUpdated();
   await this.motorcyclePartRepository.save(motorcyclePart);
   return motorcyclePart;
 }
}
