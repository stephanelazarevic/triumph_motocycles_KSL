import { RentalRepository } from "../../repositories/RentalRepository.ts";
import { ClientRepository } from "../../repositories/ClientRepository.ts";
import { MotorcycleRepository } from "../../repositories/MotorcycleRepository.ts";
import { UpdateRentalCommand } from "../../../domain/types/RentalType.ts";
import { RentalEntity } from "../../../domain/entities/RentalEntity.ts";

export class UpdateRentalUsecase {
 constructor(
   private rentalRepository: RentalRepository,
   private clientRepository: ClientRepository,
   private motorcycleRepository: MotorcycleRepository
 ) {}

 public async execute(rentalId: string, command: UpdateRentalCommand): Promise<RentalEntity | Error> {
   const rental = await this.rentalRepository.findOneById(rentalId);
   if (rental instanceof Error) {
     return rental;
   }

   if (command.clientId) {
     const client = await this.clientRepository.findOneById(command.clientId);
     if (client instanceof Error) {
       return client;
     }
     rental.client = client;
   }

   if (command.motorcycleId) {
    const motorcycle = await this.motorcycleRepository.findOneById(command.motorcycleId);
    if (motorcycle instanceof Error) {
      return motorcycle;
    }
    rental.motorcycle = motorcycle;
  }

   if (command.startDate) {
     rental.startDate = command.startDate;
   }
   if (command.endDate) {
     rental.endDate = command.endDate;
   }
   if (command.cost) {
     rental.cost = command.cost;
   }
   if (command.isCompleted) {
     rental.isCompleted = command.isCompleted;
   }

   rental.markAsUpdated();
   await this.rentalRepository.save(rental);
   return rental;
 }
}
