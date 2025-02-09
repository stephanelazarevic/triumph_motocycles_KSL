import { DealerRepository } from "../../../application/repositories/DealerRepository.ts";
import { DealerEntity } from "../../../domain/entities/DealerEntity.ts";
import { DealerNotFoundError } from "../../../domain/errors/DealerNotFoundError.ts";

export class DealerRepositoryInMemory implements DealerRepository {
  constructor(private dealers: DealerEntity[] = []) {}

  public save(dealer: DealerEntity): Promise<void> {
    const index = this.dealers.findIndex(
      (existingDealer) => existingDealer.id === dealer.id,
    );
    if (index === -1) {
      this.dealers.push(dealer);
    } else {
      this.dealers[index] = dealer;
    }
    return Promise.resolve();
  }

  public findAll(): Promise<DealerEntity[]> {
    return Promise.resolve(this.dealers);
  }

  public findOneById(id: string): Promise<DealerEntity | DealerNotFoundError> {
    const foundDealer = this.dealers.find((dealer) => dealer.id === id);
    return Promise.resolve(foundDealer ?? new DealerNotFoundError());
  }

  public delete(id: string): Promise<void> {
    this.dealers = this.dealers.filter((dealer) => dealer.id !== id);
    return Promise.resolve();
  }
}
