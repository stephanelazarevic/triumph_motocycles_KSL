import { Client } from "../../../domain/entities/Client.ts";
import type { ClientRepository } from "../../repositories/ClientRepository.ts";

export class ListClientsUsecase {
  public constructor(private readonly clientRepository: ClientRepository) {}

  public async execute(): Promise<Client[]> {
    return await this.clientRepository.findAll();
  }
}
