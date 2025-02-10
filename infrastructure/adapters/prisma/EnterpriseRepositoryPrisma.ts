import { PrismaClient } from "../../database/prisma/generated/client-deno/deno/edge.ts";
import { EnterpriseRepository } from "../../../application/repositories/EnterpriseRepository.ts";
import { EnterpriseEntity } from "../../../domain/entities/EnterpriseEntity.ts";
import { EnterpriseNotFoundError } from "../../../domain/errors/EnterpriseNotFoundError.ts";
import { UserEntity } from "../../../domain/entities/UserEntity.ts";

export class EnterpriseRepositoryPrisma implements EnterpriseRepository {
  public constructor(private prisma: PrismaClient) {}

  public async save(enterprise: EnterpriseEntity): Promise<void> {
    await this.prisma.enterprise.create({
      data: {
        id: enterprise.id,
        user: enterprise.user,
        TaxNumber: enterprise.taxNumber.getValue(),
        IndustryType: enterprise.industryType.getValue(),
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
            hashedPassword: user.hashedPassword,
            emailAddress: user.emailAddress,
            phoneNumber: user.phoneNumber,
            address: user.address,
            isAdministrator: user.isAdministrator,
            token: user.token
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
            hashedPassword: user.hashedPassword,
            emailAddress: user.emailAddress,
            phoneNumber: user.phoneNumber,
            address: user.address,
            isAdministrator: user.isAdministrator,
            token: user.token
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
