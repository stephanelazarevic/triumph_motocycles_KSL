import { Dealer } from "../../../domain/entities/DealerEntity.ts";
import type { DealerRepository } from "../../repositories/DealerRepository.ts";

export class ListDealersUsecase {
  public constructor(private readonly dealerRepository: DealerRepository) {}

  public async execute(): Promise<Dealer[]> {
    return await this.dealerRepository.findAll();
  }
}
