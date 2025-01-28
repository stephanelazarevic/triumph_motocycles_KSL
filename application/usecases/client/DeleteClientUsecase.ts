import { ClientRepository } from "../../../application/repositories/ClientRepository.ts";
import { UserRepository } from "../../../application/repositories/UserRepository.ts";
import { ClientNotFoundError } from "../../../domain/errors/ClientNotFoundError.ts";

export class DeleteClientUseCase {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly userRepository: UserRepository
  ) {}

  public async execute(id: string): Promise<void> {
    const client = await this.clientRepository.findOneById(id);
    if (client instanceof ClientNotFoundError) {
      throw client;
    }

    await this.userRepository.delete(client.user.id);

    await this.clientRepository.delete(id);
  }
}
