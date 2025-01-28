import { DealerRepository } from "../../../application/repositories/DealerRepository.ts";
import { UserRepository } from "../../../application/repositories/UserRepository.ts";
import { DealerNotFoundError } from "../../../domain/errors/DealerNotFoundError.ts";

export class DeleteDealerUseCase {
  constructor(
    private readonly dealerRepository: DealerRepository,
    private readonly userRepository: UserRepository
  ) {}

  public async execute(id: string): Promise<void> {
    const dealer = await this.dealerRepository.findOneById(id);
    if (dealer instanceof DealerNotFoundError) {
      throw dealer;
    }

    await this.userRepository.delete(dealer.user.id);

    await this.dealerRepository.delete(id);
  }
}
