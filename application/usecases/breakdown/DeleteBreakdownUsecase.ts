import { BreakdownRepository } from "../../repositories/BreakdownRepository";
import { BreakdownNotFoundError } from "../../../domain/errors/BreakdownNotFoundError.ts";

export class DeleteBreakdownUsecase {
    constructor(private breakdownRepository: BreakdownRepository) {}
  
    public async execute(id: string): Promise<BreakdownNotFoundError | void> {
      const existing = await this.breakdownRepository.findOneById(id);
      if (!existing) {
        return new BreakdownNotFoundError();
      }
      await this.breakdownRepository.delete(id);
    }
  }
  