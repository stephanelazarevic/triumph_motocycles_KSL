import { DealerEntity } from "../../domain/entities/DealerEntity.ts";
import { DealerNotFoundError } from "../../domain/errors/DealerNotFoundError.ts";

export interface DealerRepository {
  save(dealer: DealerEntity): Promise<void>;
  findAll(): Promise<DealerEntity[]>;
  findOneById(id: string): Promise<DealerEntity | DealerNotFoundError>;
  delete(id: string): Promise<void>;
}
