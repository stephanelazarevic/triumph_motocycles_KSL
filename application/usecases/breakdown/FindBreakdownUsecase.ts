import { BreakdownEntity } from "../../../domain/entities/BreakdownEntity";
import { BreakdownNotFoundError } from "../../../domain/errors/BreakdownNotFoundError";
import { BreakdownRepository } from "../../repositories/BreakdownRepository";

export class FindBreakdownUsecase {
    constructor(private breakdownRepository: BreakdownRepository) {}
  
    public async execute(id: string): Promise<BreakdownEntity | BreakdownNotFoundError> {
      const existing = await this.breakdownRepository.findOneById(id);
      if (!existing) {
        return new BreakdownNotFoundError();
      }
      return existing
    }
  }
  