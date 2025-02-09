import { PrismaClient } from "../../database/prisma/generated/client-deno/deno/edge.ts";
import { PartRepository } from "../../../application/repositories/PartRepository.ts";
import { PartEntity } from "../../../domain/entities/PartEntity.ts";
import { EnterpriseNotFoundError } from "../../../domain/errors/EnterpriseNotFoundError.ts";
import { UserEntity } from "../../../domain/entities/UserEntity.ts";

export class PartRepositoryPrisma implements PartRepository {
  public constructor(private prisma: PrismaClient) {}

  public async save(part: PartEntity): Promise<void> {
    await this.prisma.part.create({
      data: {
        id: part.id,
        dealer: part.dealerId,
      }
    });
  }

  public async findAll(): Promise<EnterpriseEntity[]> {
    const enterprises = await this.prisma.enterprise.findMany({
      include: {
        drivers: true
      }
    });

    return enterprises.map(enterprise =>
      EnterpriseEntity.reconstitute({
        id: enterprise.id,
        user: enterprise.user.map(user => UserEntity.reconstitute({
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            emailAddress: user.emailAddress,
            phoneNumber: user.phoneNumber,
            address: user.address,
            isAdministrator: user.isAdministrator
        })),
        taxNumber: enterprise.taxNumber,
        industryType: enterprise.industryType
      })
    );
  }

  public async findOneById(id: string): Promise<EnterpriseEntity | EnterpriseNotFoundError> {
    const enterprise = await this.prisma.enterprise.findUnique({
      where: { id }
    });

    if (!enterprise) {
      return new EnterpriseNotFoundError();
    }

    return EnterpriseEntity.reconstitute({
      id: enterprise.id,
      user: enterprise.user.map(user => UserEntity.reconstitute({
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        emailAddress: user.emailAddress,
        phoneNumber: user.phoneNumber,
        address: user.address,
        isAdministrator: user.isAdministrator
    })),
      taxNumber: enterprise.taxNumber,
      industryType: enterprise.industryType
    });
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.enterprise.delete({
      where: { id }
    });
  }
}
