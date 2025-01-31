import { DealerEntity } from "../../../domain/entities/DealerEntity.ts";
import { DealerNotFoundError } from "../../../domain/errors/DealerNotFoundError.ts";
import { DealerRepository } from "../../repositories/DealerRepository.ts";

export class GetDealerUsecase {
  constructor(private dealerRepository: DealerRepository) {}

  public async execute(id: string): Promise<DealerEntity | DealerNotFoundError> {
    const existingDealer = await this.dealerRepository.findOneById(id);
    if (!existingDealer) {
      return new DealerNotFoundError();
    }
    return existingDealer;
  }
}
