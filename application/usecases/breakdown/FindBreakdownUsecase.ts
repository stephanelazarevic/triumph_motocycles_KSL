import { BreakdownEntity } from "../../../domain/entities/BreakdownEntity.ts";
import { BreakdownNotFoundError } from "../../../domain/errors/BreakdownNotFoundError.ts";
import { BreakdownRepository } from "../../repositories/BreakdownRepository.ts";

export class FindBreakdownUsecase {
  constructor(private breakdownRepository: BreakdownRepository) {}

  public async execute(
    id: string
  ): Promise<BreakdownEntity | BreakdownNotFoundError> {
    const existing = await this.breakdownRepository.findOneById(id);
    if (!existing) {
      return new BreakdownNotFoundError();
    }
    return existing;
  }
}
