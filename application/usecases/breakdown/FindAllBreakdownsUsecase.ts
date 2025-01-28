import { BreakdownEntity } from "../../../domain/entities/BreakdownEntity.ts";
import type { BreakdownRepository } from "../../repositories/BreakdownRepository.ts";

export class FindAllBreakdownsUsecase {
  public constructor(
    private readonly breakdownRepository: BreakdownRepository,
  ) {}

  public async execute(): Promise<BreakdownEntity[]> {
    return await this.breakdownRepository.findAll();
  }
}
