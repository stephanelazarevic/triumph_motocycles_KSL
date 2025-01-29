import { DealerRepository } from "../../repositories/DealerRepository.ts";
import { EnterpriseNotFoundError } from "../../../domain/errors/EnterpriseNotFoundError.ts";
import { SoftDeleteUserUsecase } from "../user/SoftDeleteUserUsecase.ts";

export class SoftDeleteDealerUsecase {
  constructor(
    private readonly dealerRepository: DealerRepository,
    private readonly softDeleteUserUscase: SoftDeleteUserUsecase,
  ) {}

  public async execute(id: string): Promise<void> {
    const dealer = await this.dealerRepository.findOneById(id);
    if (dealer instanceof EnterpriseNotFoundError) {
      throw dealer;
    }

    await this.softDeleteUserUscase.execute(dealer.user.id);
    dealer.deletedAt = new Date();
    dealer.markAsUpdated();
    await this.dealerRepository.save(dealer);
  }
}
