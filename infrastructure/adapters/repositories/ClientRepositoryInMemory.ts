import { ClientRepository } from "../../../application/repositories/ClientRepository.ts";
import { ClientEntity } from "../../../domain/entities/ClientEntity.ts";
import { ClientNotFoundError } from "../../../domain/errors/ClientNotFoundError.ts";

export class ClientRepositoryInMemory implements ClientRepository {
  constructor(private clients: ClientEntity[] = []) {}

  /**
   * Saves a client to the repository. If the client exists, it updates the record.
   */
  public save(client: ClientEntity): Promise<void> {
    const index = this.clients.findIndex(
      (existingClient) => existingClient.id === client.id,
    );
    if (index === -1) {
      this.clients.push(client);
    } else {
      this.clients[index] = client;
    }
    return Promise.resolve();
  }

  /**
   * Finds all clients in the repository.
   */
  public findAll(): Promise<ClientEntity[]> {
    return Promise.resolve(this.clients);
  }

  /**
   * Finds a single client by ID. Returns the client or throws a ClientNotFoundError.
   */
  public findOneById(id: string): Promise<ClientEntity | ClientNotFoundError> {
    const foundClient = this.clients.find((client) => client.id === id);
    return Promise.resolve(foundClient ?? new ClientNotFoundError());
  }

  /**
   * Deletes a client by ID.
   */
  public delete(id: string): Promise<void> {
    this.clients = this.clients.filter((client) => client.id !== id);
    return Promise.resolve();
  }
}
