import { Dealer } from "../../../domain/entities/DealerEntity.ts";
import { DealerRepository } from "../../repositories/DealerRepository.ts";
import { AddUserUsecase } from "../user/AddUserUsecase.ts";
import { AddDealerCommand } from "../../../domain/types/DealerType.ts";

export class AddDealerUsecase {

  public constructor(
    private readonly dealerRepository: DealerRepository,
    private readonly addUserUsecase: AddUserUsecase,
  ) {
    this.addUserUsecase = addUserUsecase;
  }

  public async execute(command: AddDealerCommand) {
    const user = await this.addUserUsecase.execute({
      firstname: command.firstname,
      lastname: command.lastname,
      emailAddress: command.emailAddress,
      plainPassword: command.plainPassword,
      phoneNumber: command.phoneNumber,
      address: command.address,
    });
    if (user instanceof Error) {
      return user;
    }

    const dealer = Dealer.create( {
      user,
      site: command.site,
    });
    if (dealer instanceof Error) {
      return dealer;
    }
    await this.dealerRepository.save(dealer);

    return dealer;
  }
}
