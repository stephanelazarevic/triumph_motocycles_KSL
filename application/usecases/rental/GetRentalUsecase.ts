import { RentalEntity } from "../../../domain/entities/RentalEntity.ts";
import { RentalNotFoundError } from "../../../domain/errors/RentalNotFoundError.ts";
import { RentalRepository } from "../../repositories/RentalRepository.ts";

export class GetRentalUsecase {
  constructor(private rentalRepository: RentalRepository) {}

  public async execute(id: string): Promise<RentalEntity | RentalNotFoundError> {
    const existingRental = await this.rentalRepository.findOneById(id);
    if (!existingRental) {
      return new RentalNotFoundError();
    }

    return existingRental;
  }
}
