import { PrismaClient } from "../../database/prisma/generated/client-deno/deno/edge.ts";
import { MotorcyclePartRepository } from "../../../application/repositories/MotorcyclePartRepository.ts";
import { MotorcyclePartEntity } from "../../../domain/entities/MotorcyclePartEntity.ts";
import { DriverEntity } from "../../../domain/entities/DriverEntity.ts";
import { MotorcycleEntity } from "../../../domain/entities/MotorcycleEntity.ts";
import { PartEntity } from "../../../domain/entities/PartEntity.ts";
import { DealerEntity } from "../../../domain/entities/DealerEntity.ts";
import { UserEntity } from "../../../domain/entities/UserEntity.ts";
import { MotorcyclePartNotFoundError } from "../../../domain/errors/MotorcyclePartNotFoundError.ts";

export class MotorcyclePartRepositoryPrisma implements MotorcyclePartRepository {
  public constructor(private prisma: PrismaClient) {}

  public async save(motorcyclePart: MotorcyclePartEntity): Promise<void> {
    await this.prisma.motorcyclePart.create({
      data: {
        id: motorcyclePart.id,
        motorcycle: motorcyclePart.motorcycle,
        part: motorcyclePart.part
      }
    });
  }

  public async findAll(): Promise<MotorcyclePartEntity[]> {
    const motorcycleParts = await this.prisma.motorcyclePart.findMany();

return motorcycleParts.map(motorcyclePart =>
  MotorcyclePartEntity.reconstitute({
    id: motorcyclePart.id,
    motorcycle: motorcyclePart.motorcycle.map(motorcycle =>
      MotorcycleEntity.reconstitute({
        id: motorcycle.id,
        dealerId: motorcycle.dealerId,
        clientId: motorcycle.clientId,
        drivers: motorcycle.drivers ? motorcycle.drivers.map(driver =>
          DriverEntity.reconstitute({
            id: driver.id,
            enterpriseId: driver.enterpriseId,
            motorcycleId: driver.motorcycleId,
            firstname: driver.firstname.getValue(),
            lastname: driver.lastname.getValue(),
            licenseNumber: driver.licenseNumber,
            phoneNumber: driver.phoneNumber.getValue(),
            emailAddress: driver.emailAddress.getValue()
          })
        ) : null,
        brand: motorcycle.brand,
        model: motorcycle.model,
        year: motorcycle.year,
        registrationNumber: motorcycle.registrationNumber,
        status: motorcycle.status,
        enterpriseId: motorcycle.enterpriseId
      })
    ),
    part: motorcyclePart.part.map(part =>
      PartEntity.reconstitute({
        id: part.id,
        dealer: part.dealer.map(dealer =>
            DealerEntity.reconstitute({
                user: dealer.user.map(user =>
                    UserEntity.reconstitute({
                        firstname: user.firstname.getValue(),
                        lastname: user.lastname.getValue(),
                        emailAddress: user.emailAddress.getValue(),
                        hashedPassword: user.hashedPassword,
                        phoneNumber: user.phoneNumber.getValue(),
                        address: user.address.getValue(),
                        isAdministrator: user.isAdministrator
                    })),
                site: dealer.site
            })),
        reference: part.reference,
        type: part.type,
        price: part.price,
        stockQuantity: part.stockQuantity,
        order: part.order
      })
    )
}));
  }

  public async findOneById(id: string): Promise<MotorcyclePartEntity | MotorcyclePartNotFoundError> {
    const motorcyclePart = await this.prisma.motorcyclePart.findUnique({
      where: { id }
    });

    if (!motorcyclePart) {
      return new MotorcyclePartNotFoundError();
    }

    return MotorcyclePartEntity.reconstitute({
        id: motorcyclePart.id,
        motorcycle: motorcyclePart.motorcycle.map(motorcycle =>
          MotorcycleEntity.reconstitute({
            id: motorcycle.id,
            dealerId: motorcycle.dealerId,
            clientId: motorcycle.clientId,
            drivers: motorcycle.drivers ? motorcycle.drivers.map(driver =>
              DriverEntity.reconstitute({
                id: driver.id,
                enterpriseId: driver.enterpriseId,
                motorcycleId: driver.motorcycleId,
                firstname: driver.firstname.getValue(),
                lastname: driver.lastname.getValue(),
                licenseNumber: driver.licenseNumber,
                phoneNumber: driver.phoneNumber.getValue(),
                emailAddress: driver.emailAddress.getValue()
              })
            ) : null,
            brand: motorcycle.brand,
            model: motorcycle.model,
            year: motorcycle.year,
            registrationNumber: motorcycle.registrationNumber,
            status: motorcycle.status,
            enterpriseId: motorcycle.enterpriseId
          })
        ),
        part: motorcyclePart.part.map(part =>
          PartEntity.reconstitute({
            id: part.id,
            dealer: part.dealer.map(dealer =>
                DealerEntity.reconstitute({
                    user: dealer.user.map(user =>
                        UserEntity.reconstitute({
                            firstname: user.firstname.getValue(),
                            lastname: user.lastname.getValue(),
                            emailAddress: user.emailAddress.getValue(),
                            hashedPassword: user.hashedPassword,
                            phoneNumber: user.phoneNumber.getValue(),
                            address: user.address.getValue(),
                            isAdministrator: user.isAdministrator
                        })),
                    site: dealer.site
                })),
            reference: part.reference,
            type: part.type,
            price: part.price,
            stockQuantity: part.stockQuantity,
            order: part.order
          })
        )
    });
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.motorcyclePart.delete({
      where: { id }
    });
  }
}
