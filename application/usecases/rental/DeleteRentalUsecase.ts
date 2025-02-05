import { RentalRepository } from "../../repositories/RentalRepository.ts";
import { RentalNotFoundError } from "../../../domain/errors/RentalNotFoundError.ts";

export class DeleteRentalUsecase {
  constructor(private rentalRepository: RentalRepository) {}

  public async execute(id: string): Promise<RentalNotFoundError | void> {
    const existingRental = await this.rentalRepository.findOneById(id);
    if (!existingRental) {
      return new RentalNotFoundError();
    }

    await this.rentalRepository.delete(id);
  }
}
