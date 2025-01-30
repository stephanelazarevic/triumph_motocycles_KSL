import { ClientEntity } from "../../../domain/entities/ClientEntity.ts";
import { ClientNotFoundError } from "../../../domain/errors/ClientNotFoundError.ts";
import { ClientRepository } from "../../repositories/ClientRepository.ts";

export class GetClientUsecase {
  constructor(private clientRepository: ClientRepository) {}

  public async execute(id: string): Promise<ClientEntity | ClientNotFoundError> {
    const existingClient = await this.clientRepository.findOneById(id);
    if (!existingClient) {
      return new ClientNotFoundError();
    }
    return existingClient;
  }
}
