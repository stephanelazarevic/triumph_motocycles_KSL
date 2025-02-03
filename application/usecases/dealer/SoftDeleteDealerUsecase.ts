import { DealerRepository } from "../../repositories/DealerRepository.ts";
import { SoftDeleteUserUsecase } from "../user/SoftDeleteUserUsecase.ts";
import { DealerNotFoundError } from "../../../domain/errors/DealerNotFoundError.ts";

export class SoftDeleteDealerUsecase {
  constructor(
    private readonly dealerRepository: DealerRepository,
    private readonly softDeleteUserUscase: SoftDeleteUserUsecase,
  ) {}

  public async execute(id: string): Promise<void | DealerNotFoundError> {
    const dealer = await this.dealerRepository.findOneById(id);
    if (dealer instanceof DealerNotFoundError) {
      return dealer;
    }

    await this.softDeleteUserUscase.execute(dealer.user.id);

    dealer.markAsDeleted();
    await this.dealerRepository.save(dealer);
  }
}
