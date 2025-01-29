import { Dealer } from "../../domain/entities/Dealer.ts";
import { DealerNotFoundError } from "../../domain/errors/DealerNotFoundError.ts";

export interface DealerRepository {
  save(dealer: Dealer): Promise<void>;
  findAll(): Promise<Dealer[]>;
  findOneById(id: string): Promise<Dealer | DealerNotFoundError>;
  delete(id: string): Promise<void>;
}
