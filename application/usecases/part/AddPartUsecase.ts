import { AddPartCommand } from "../../../domain/types/PartType.ts";
import { PartRepository } from "../../repositories/PartRepository.ts";
import { DealerRepository } from "../../repositories/DealerRepository.ts";
import { OrderRepository } from "../../repositories/OrderRepository.ts";
import { PartEntity } from "../../../domain/entities/PartEntity.ts";
import { DealerNotFoundError } from "../../../domain/errors/DealerNotFoundError.ts";
import { OrderNotFoundError } from "../../../domain/errors/OrderNotFoundError.ts";

export class AddPartUsecase {
  public constructor(
    private readonly partRepository: PartRepository,
    private readonly dealerRepository: DealerRepository,
    private readonly orderRepository: OrderRepository,
  ) {}

  public async execute(command: AddPartCommand): Promise<PartEntity | Error> {
    const dealer = await this.dealerRepository.findOneById(command.dealerId);

    if (dealer instanceof DealerNotFoundError) {
      return dealer;
    }

    const order = command.orderId ? await this.orderRepository.findOneById(command.orderId): undefined;

    if(order instanceof OrderNotFoundError){
      return order;
    }

    const part = PartEntity.create({
      dealer,
      order,
      reference: command.reference,
      type: command.type,
      price: command.price,
      stockQuantity: command.stockQuantity,
    });

    await this.partRepository.save(part);
    return part;
  }
}
