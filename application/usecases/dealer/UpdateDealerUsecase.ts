import { DealerEntity } from "../../../domain/entities/DealerEntity.ts";
import { DealerRepository } from "../../repositories/DealerRepository.ts";
import { DealerNotFoundError } from "../../../domain/errors/DealerNotFoundError.ts";

export class UpdateDealerUsecase {
  constructor(private dealerRepository: DealerRepository) {}

  public async execute(
    dealer: DealerEntity,
  ): Promise<DealerNotFoundError | void> {
    const existingDealer = await this.dealerRepository.findOneById(dealer.id);
    if (!existingDealer) {
      return new DealerNotFoundError();
    }
    await this.dealerRepository.save(dealer);
  }
}
