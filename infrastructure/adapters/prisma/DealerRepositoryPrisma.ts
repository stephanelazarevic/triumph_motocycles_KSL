import { PrismaClient } from "../../database/prisma/generated/client-deno/deno/edge.ts";
import { DealerRepository } from "../../../application/repositories/DealerRepository.ts";
import { DealerNotFoundError } from "../../../domain/errors/DealerNotFoundError.ts";
import { DealerEntity } from "../../../domain/entities/DealerEntity.ts";
import { UserEntity } from "../../../domain/entities/UserEntity.ts";

export class DealerRepositoryPrisma implements DealerRepository {
  public constructor(private prisma: PrismaClient) {}

  public async save(dealer: DealerEntity): Promise<void> {
    await this.prisma.dealer.create({
      data: {
        id: dealer.id,
        user: dealer.user,
        site: dealer.site,
      }
    });
  }

  public async findAll(): Promise<DealerEntity[]> {
    const dealers = await this.prisma.dealer.findMany();

    return dealers.map(dealer =>
      DealerEntity.reconstitute({
        id: dealer.id,
        user: dealer.user.map(user => 
          UserEntity.reconstitute({
            firstname: user.firstname,
            lastname: user.lastname,
            emailAddress: user.emailAddress.getValue(),
            hashedPassword: user.hashedPassword.getValue(),
            phoneNumber: user.phoneNumber.getValue(),
            address: user.address.getValue(),
            isAdministrator: user.isAdministrator,
          })
        ),
        site: dealer.site,
      })
    );
  }

  public async findOneById(id: string): Promise<DealerEntity | DealerNotFoundError> {
    const dealer = await this.prisma.dealer.findUnique(
        { where: { id } }
    );

    if (!dealer) {
      return new DealerNotFoundError();
    }

    return DealerEntity.reconstitute({
      id: dealer.id,
      user: dealer.user.map(user => 
        UserEntity.reconstitute({
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          emailAddress: user.emailAddress.getValue(),
          hashedPassword: user.hashedPassword.getValue(),
          phoneNumber: user.phoneNumber.getValue(),
          address: user.address.getValue(),
          isAdministrator: user.isAdministrator,
        })
      ),
      site: dealer.site,
    });
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.dealer.delete({
      where: { id }
    });
  }
}
