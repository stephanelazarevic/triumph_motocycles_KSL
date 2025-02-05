import { AddPartCommand } from "../../../domain/types/PartType.ts";
import { PartRepository } from "../../repositories/PartRepository.ts";
import { DealerRepository } from "../../repositories/DealerRepository.ts";
import { PartEntity } from "../../../domain/entities/PartEntity.ts";
import { DealerNotFoundError } from "../../../domain/errors/DealerNotFoundError.ts";

export class AddPartUsecase {
  public constructor(
    private readonly partRepository: PartRepository,
    private readonly dealerRepository: DealerRepository
  ) {}

  public async execute(command: AddPartCommand): Promise<PartEntity | Error> {
    const dealer = await this.dealerRepository.findOneById(command.dealerId);

    if (dealer instanceof DealerNotFoundError) {
      return dealer;
    }

    const part = PartEntity.create({
      dealer,
      reference: command.reference,
      type: command.type,
      price: command.price,
      stockQuantity: command.stockQuantity,
    });

    await this.partRepository.save(part);
    return part;
  }
}
