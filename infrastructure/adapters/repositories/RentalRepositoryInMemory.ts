import { RentalRepository } from "../../../application/repositories/RentalRepository.ts";
import { RentalEntity } from "../../../domain/entities/RentalEntity.ts";
import { RentalNotFoundError } from "../../../domain/errors/RentalNotFoundError.ts";

export class RentalRepositoryInMemory implements RentalRepository {
  public constructor(private rentals: RentalEntity[]) {}

  public save(rental: RentalEntity): Promise<void> {
    const index = this.rentals.findIndex(
      (rental) => rental.id === rental.id
    );
    if (index === -1) {
      this.rentals.push(rental);
    } else {
      this.rentals[index] = rental;
    }
    return Promise.resolve();
  }

  public findAll(): Promise<RentalEntity[]> {
    return Promise.resolve(this.rentals);
  }

  public findOneById(id: string): Promise<RentalEntity | RentalNotFoundError> {
    const foundRental = this.rentals.find((rental) => {
      return rental.id === id;
    });

    return Promise.resolve(foundRental ?? new RentalNotFoundError());
  }

  public delete(id: string): Promise<void> {
    this.rentals = this.rentals.filter(
      (rental) => rental.id !== id
    );
    return Promise.resolve();
  }
}
