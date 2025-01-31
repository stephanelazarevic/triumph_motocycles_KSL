import { ClientRepository } from "../../repositories/ClientRepository.ts";
import { ClientNotFoundError } from "../../../domain/errors/ClientNotFoundError.ts";
import { UpdateClientDealerCommand } from "../../../domain/types/ClientType.ts";
import { DealerNotFoundError } from "../../../domain/errors/DealerNotFoundError.ts";
import { DealerRepository } from "../../repositories/DealerRepository.ts";
import { ClientEntity } from "../../../domain/entities/ClientEntity.ts";

export class UpdateClientDealerUsecase {
  constructor(
    private clientRepository: ClientRepository,
    private dealerRepository: DealerRepository,
  ) {}

  public async execute(clientId: string, command: UpdateClientDealerCommand): Promise<ClientEntity | Error> {
    const client = await this.clientRepository.findOneById(clientId);
    if (client instanceof ClientNotFoundError) {
      return client;
    }

    const dealer = await this.dealerRepository.findOneById(command.dealerId);
    if (dealer instanceof DealerNotFoundError) {
      return dealer;
    }

    client.dealerId = dealer.id;
    client.markAsUpdated();

    await this.clientRepository.save(client);
    return client;
  }
}
