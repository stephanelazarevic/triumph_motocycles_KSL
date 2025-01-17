import { BreakdownEntity } from "../../domain/entities/BreakdownEntity.ts";
import { BreakdownNotFoundError } from "../../domain/errors/BreakdownNotFoundError.ts";

export interface BreakdownRepository {
  save(maintenance: BreakdownEntity): Promise<void>;
  findAll(): Promise<BreakdownEntity[]>;
  findOneById(id: string): Promise<BreakdownEntity | BreakdownNotFoundError>;
  delete(id: string): Promise<void>;  
}
