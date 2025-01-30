import { DealerRepository } from "../../repositories/DealerRepository.ts";
import { DealerNotFoundError } from "../../../domain/errors/DealerNotFoundError.ts";
import { DealerEntity } from "../../../domain/entities/DealerEntity.ts";
import { UpdateDealerSiteCommand } from "../../../domain/types/DealerType.ts";

export class UpdateDealerSiteUsecase {
  constructor(private dealerRepository: DealerRepository) {}

  public async execute(dealerId: string, command: UpdateDealerSiteCommand): Promise<DealerEntity | Error> {
    const dealer = await this.dealerRepository.findOneById(dealerId);
    if (dealer instanceof Error) {
      return new DealerNotFoundError();
    }

    dealer.site = command.site;
    dealer.markAsUpdated();

    await this.dealerRepository.save(dealer);
    return dealer;
  }
}
