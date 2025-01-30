import { ClientEntity } from "../../../domain/entities/ClientEntity.ts";
import { AddClientCommand } from "../../../domain/types/ClientType.ts";
import { DealerRepository } from "../../repositories/DealerRepository.ts";
import { ClientRepository } from "../../repositories/ClientRepository.ts";
import { AddUserUsecase } from "../user/AddUserUsecase.ts";

export class CreateClientUsecase {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly dealerRepository: DealerRepository,
    private readonly addUserUsecase: AddUserUsecase,
  ) {
    this.addUserUsecase = addUserUsecase;
  }

  public async execute(command: AddClientCommand): Promise<ClientEntity | Error> {
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

    const dealer = await this.dealerRepository.findOneById(command.dealerId);
    if (dealer instanceof Error) {
      return dealer;
    }

    const client = ClientEntity.create({ user, dealerId: dealer.id });
    await this.clientRepository.save(client);

    return client;
  }
}
