import { ClientEntity } from "../../../domain/entities/ClientEntity.ts";
import { ClientRepository } from "../../repositories/ClientRepository.ts";
import { ClientNotFoundError } from "../../../domain/errors/ClientNotFoundError.ts";

export class UpdateClientUsecase {
  constructor(private clientRepository: ClientRepository) {}

  public async execute(
    dealer: ClientEntity,
  ): Promise<ClientNotFoundError | void> {
    const existingClient = await this.clientRepository.findOneById(dealer.id);
    if (!existingClient) {
      return new ClientNotFoundError();
    }
    await this.clientRepository.save(dealer);
  }
}
