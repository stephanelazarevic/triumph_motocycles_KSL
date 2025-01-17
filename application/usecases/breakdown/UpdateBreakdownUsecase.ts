import { BreakdownRepository } from "../../repositories/BreakdownRepository";
import { BreakdownEntity } from "../../../domain/entities/BreakdownEntity.ts";
import { BreakdownNotFoundError } from "../../../domain/errors/BreakdownNotFoundError.ts";

export class UpdateBreakdownUsecase {
    constructor(private breakdownRepository: BreakdownRepository) {}
  
    public async execute(breakdown: BreakdownEntity): Promise<BreakdownNotFoundError | void> {
      const existing = await this.breakdownRepository.findOneById(breakdown.identifier);
      if (!existing) {
        return new BreakdownNotFoundError();
      }
      await this.breakdownRepository.save(breakdown);
    }
  }
  