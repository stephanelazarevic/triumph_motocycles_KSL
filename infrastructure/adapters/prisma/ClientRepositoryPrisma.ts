import { PrismaClient } from "../../database/prisma/generated/client-deno/deno/edge.ts";
import { ClientRepository } from "../../../application/repositories/ClientRepository.ts";
import { ClientEntity } from "../../../domain/entities/ClientEntity.ts";
import { UserEntity } from "../../../domain/entities/UserEntity.ts";
import { ClientNotFoundError } from "../../../domain/errors/ClientNotFoundError.ts";

export class ClientRepositoryPrisma implements ClientRepository {
  public constructor(private prisma: PrismaClient) {}

  public async save(client: ClientEntity): Promise<void> {
    await this.prisma.client.create({
      data: {
        id: client.id,
        user: client.user,
        dealerId: client.dealerId,
      }
    });
  }

  public async findAll(): Promise<ClientEntity[]> {
    const clients = await this.prisma.client.findMany();

    return clients.map(client =>
      ClientEntity.reconstitute({
        id: client.id,
        user: client.user.map(user =>
            UserEntity.reconstitute({
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                hashedPassword: user.hashedPassword,
                emailAddress: user.emailAddress,
                phoneNumber: user.phoneNumber,
                address: user.address,
                isAdministrator: user.isAdministrator,
                token: user.token,
            })),
        dealerId: client.dealerId,
      })
    );
  }

  public async findOneById(id: string): Promise<ClientEntity | ClientNotFoundError> {
    const client = await this.prisma.client.findUnique(
        { where: { id } }
    );

    if (!client) {
      return new ClientNotFoundError();
    }

    return ClientEntity.reconstitute({
        id: client.id,
        user: client.user.map(user =>
            UserEntity.reconstitute({
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                hashedPassword: user.hashedPassword,
                emailAddress: user.emailAddress,
                phoneNumber: user.phoneNumber,
                address: user.address,
                isAdministrator: user.isAdministrator,
                token: user.token,
            })),
        dealerId: client.dealerId,
      });
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.client.delete({
      where: { id }
    });
  }
}
