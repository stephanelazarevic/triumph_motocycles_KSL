import { DealerEntity } from "../../../domain/entities/DealerEntity.ts";
import type { DealerRepository } from "../../repositories/DealerRepository.ts";

export class FindAllDealersUsecase {
  public constructor(private readonly dealerRepository: DealerRepository) {}

  public async execute(): Promise<DealerEntity[]> {
    return await this.dealerRepository.findAll();
  }
}
