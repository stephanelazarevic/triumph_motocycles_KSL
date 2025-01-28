import { ClientEntity } from "../../domain/entities/ClientEntity.ts";
import { ClientNotFoundError } from "../../domain/errors/ClientNotFoundError.ts";

export interface ClientRepository {
  save(client: ClientEntity): Promise<void>;
  findAll(): Promise<ClientEntity[]>;
  findById(id: string): Promise<ClientEntity | ClientNotFoundError>;
  delete(id: string): Promise<void>;
}
