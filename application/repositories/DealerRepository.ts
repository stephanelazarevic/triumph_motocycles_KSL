import { DealerEntity } from "../../domain/entities/DealerEntity.ts";

export interface DealerRepository {
  save(dealer: DealerEntity): Promise<void>;
  findAll(): Promise<DealerEntity[]>;
  findById(id: string): Promise<DealerEntity>;
  delete(id: string): Promise<void>;
}
