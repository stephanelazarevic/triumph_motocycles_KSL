import { ClientEntity } from "../../../domain/entities/ClientEntity.ts";
import type { ClientRepository } from "../../repositories/ClientRepository.ts";

export class ListClientsUsecase {
  public constructor(private readonly clientRepository: ClientRepository) {}

  public async execute(): Promise<ClientEntity[]> {
    return await this.clientRepository.findAll();
  }
}
