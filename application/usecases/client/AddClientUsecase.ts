import { Client } from "../../../domain/entities/Client.ts";
import { AddClientCommand } from "../../../domain/types/ClientType.ts";
import { DealerRepository } from "../../repositories/DealerRepository.ts";
import { ClientRepository } from "../../repositories/ClientRepository.ts";
import { AddUserUsecase } from "../user/AddUserUsecase.ts";

export class CreateClientUsecase {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly dealerRepository: DealerRepository,
    private readonly createUserUsecase: AddUserUsecase,
  ) {
    this.createUserUsecase = createUserUsecase;
  }

  public async execute(command: AddClientCommand
  ): Promise<Client | Error> {
    const user = await this.createUserUsecase.execute({
      firstname: command.firstname,
      lastname: command.lastname,
      emailAddress: command.emailAddress,
      plainPassword: command.plainPassword,
      phoneNumber: command.phoneNumber,
      address: command.address
    });
    if (user instanceof Error) {
      return user;
    }

    const dealer = await this.dealerRepository.findOneById(command.dealerId);
    if (dealer instanceof Error) {
      return dealer;
    }

    const client = Client.create({ user, dealerId: dealer.id });
    await this.clientRepository.save(client);

    return client;
  }
}
