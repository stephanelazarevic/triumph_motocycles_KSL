import { DealerRepository } from "../../../application/repositories/DealerRepository.ts";
import { DealerEntity } from "../../../domain/entities/DealerEntity.ts";
import { DealerNotFoundError } from "../../../domain/errors/DealerNotFoundError.ts";

export class DealerRepositoryInMemory implements DealerRepository {
  constructor(private dealers: DealerEntity[] = []) {}

  /**
   * Saves a dealer to the repository. If the dealer exists, it updates the record.
   */
  public save(dealer: DealerEntity): Promise<void> {
    const index = this.dealers.findIndex(
      (existingDealer) => existingDealer.id === dealer.id
    );
    if (index === -1) {
      this.dealers.push(dealer);
    } else {
      this.dealers[index] = dealer;
    }
    return Promise.resolve();
  }

  /**
   * Finds all dealers in the repository.
   */
  public findAll(): Promise<DealerEntity[]> {
    return Promise.resolve(this.dealers);
  }

  /**
   * Finds a single dealer by ID. Returns the dealer or throws a DealerNotFoundError.
   */
  public findOneById(id: string): Promise<DealerEntity | DealerNotFoundError> {
    const foundDealer = this.dealers.find((dealer) => dealer.id === id);
    return Promise.resolve(foundDealer ?? new DealerNotFoundError());
  }

  /**
   * Deletes a dealer by ID.
   */
  public delete(id: string): Promise<void> {
    this.dealers = this.dealers.filter((dealer) => dealer.id !== id);
    return Promise.resolve();
  }
}
