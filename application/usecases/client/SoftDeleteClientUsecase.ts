import { ClientRepository } from "../../repositories/ClientRepository.ts";
import { SoftDeleteUserUsecase } from "../user/SoftDeleteUserUsecase.ts";
import { ClientNotFoundError } from "../../../domain/errors/ClientNotFoundError.ts";

export class SoftDeleteEnterpriseUsecase {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly softDeleteUserUscase: SoftDeleteUserUsecase,
  ) {}

  public async execute(id: string): Promise<void | ClientNotFoundError> {
    const client = await this.clientRepository.findOneById(id);
    if (client instanceof ClientNotFoundError) {
      return  client;
    }

    await this.softDeleteUserUscase.execute(client.user.id);

    client.deletedAt = new Date();
    client.markAsUpdated();

    await this.clientRepository.save(client);
  }
}
