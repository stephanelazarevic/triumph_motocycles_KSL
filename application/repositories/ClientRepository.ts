import { Client } from "../../domain/entities/Client.ts";
import { ClientNotFoundError } from "../../domain/errors/ClientNotFoundError.ts";

export interface ClientRepository {
  save(client: Client): Promise<void>;
  findAll(): Promise<Client[]>;
  findOneById(id: string): Promise<Client | ClientNotFoundError>;
  delete(id: string): Promise<void>;
}
