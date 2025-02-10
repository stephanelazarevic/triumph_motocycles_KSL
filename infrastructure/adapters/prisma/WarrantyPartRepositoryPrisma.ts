import { PrismaClient } from "../../database/prisma/generated/client-deno/deno/edge.ts";
import { WarrantyPartRepository } from "../../../application/repositories/WarrantyPartRepository.ts";
import { WarrantyPartEntity } from "../../../domain/entities/WarrantyPartEntity.ts";
import { MotorcycleEntity } from "../../../domain/entities/MotorcycleEntity.ts";
import { DriverEntity } from "../../../domain/entities/DriverEntity.ts";
import { PartEntity } from "../../../domain/entities/PartEntity.ts";
import { WarrantyEntity } from "../../../domain/entities/WarrantyEntity.ts";
import { DealerEntity } from "../../../domain/entities/DealerEntity.ts";
import { UserEntity } from "../../../domain/entities/UserEntity.ts";
import { OrderEntity } from "../../../domain/entities/OrderEntity.ts";
import { WarrantyPartNotFoundError } from "../../../domain/errors/WarrantyPartNotFoundError.ts";

export class WarrantyPartRepositoryPrisma implements WarrantyPartRepository {
  public constructor(private prisma: PrismaClient) {}

  public async save(warrantyPart: WarrantyPartEntity): Promise<void> {
    await this.prisma.warrantyPart.create({
      data: {
        id: warrantyPart.id,
        part: warrantyPart.part,
        warranty: warrantyPart.warranty,
        coveredCost: warrantyPart.coveredCost,
        remainingCost: warrantyPart.remainingCost
      }
    });
  }

  public async findAll(): Promise<WarrantyPartEntity[]> {
    const warrantyParts = await this.prisma.warrantyPart.findMany();

    return warrantyParts.map(warrantyPart =>
      WarrantyPartEntity.reconstitute({
        id: warrantyPart.id,
        part: warrantyPart.part.map(part =>
            PartEntity.reconstitute({
                id: part.id,
                dealer: part.dealer.map(dealer =>
                    DealerEntity.reconstitute({
                        id: dealer.id,
                        user: dealer.user.map(user =>
                            UserEntity.reconstitute({
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
                        site: dealer.site
                    })),
                reference: part.reference,
                type: part.type,
                price: part.price,
                stockQuantity: part.stockQuantity,
                order: part.order.map(order =>
                    OrderEntity.reconstitute({
                        id: order.id,
                        parts: order.parts,
                        orderDate: order.orderDate,
                        status: order.status,
                        totalAmount: order.totalAmount
                    }))
            })),
        warranty: warrantyPart.warranty.map(warranty =>
            WarrantyEntity.reconstitute({
                id: warranty.id,
                startDate: warranty.startDate,
                endDate: warranty.endDate,
                type: warranty.type,
                motorcycle: warranty.motorcycle.map(motorcycle =>
                    MotorcycleEntity.reconstitute({
                        id: motorcycle.id,
                        dealerId: motorcycle.dealerId,
                        brand: motorcycle.brand,
                        model: motorcycle.model,
                        year: motorcycle.year,
                        registrationNumber: motorcycle.registrationNumber,
                        status: motorcycle.status,
                        clientId: motorcycle.clientId,
                        drivers: motorcycle.drivers ? motorcycle.drivers.map(driver =>
                            DriverEntity.reconstitute({
                                id: driver.id,
                                enterpriseId: driver.enterpriseId,
                                motorcycleId: driver.motorcycleId,
                                firstname: driver.firstname,
                                lastname: driver.lastname,
                                licenseNumber: driver.licenseNumber,
                                phoneNumber: driver.phoneNumber,
                                emailAddress: driver.emailAddress
                            })
                        ) : null,
                        enterpriseId: motorcycle.enterpriseId
                    })),
                terms: warranty.terms
            })),
        coveredCost: warrantyPart.coveredCost,
        remainingCost: warrantyPart.remainingCost
      })
    );
  }

  public async findOneById(id: string): Promise<WarrantyPartEntity | WarrantyPartNotFoundError> {
    const warrantyPart = await this.prisma.warrantyPart.findUnique(
        { where: { id } }
    );

    if (!warrantyPart) {
      return new WarrantyPartNotFoundError();
    }

    return WarrantyPartEntity.reconstitute({
        id: warrantyPart.id,
        part: warrantyPart.part.map(part =>
            PartEntity.reconstitute({
                id: part.id,
                dealer: part.dealer.map(dealer =>
                    DealerEntity.reconstitute({
                        id: dealer.id,
                        user: dealer.user.map(user =>
                            UserEntity.reconstitute({
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
                        site: dealer.site
                    })),
                reference: part.reference,
                type: part.type,
                price: part.price,
                stockQuantity: part.stockQuantity,
                order: part.order.map(order =>
                    OrderEntity.reconstitute({
                        id: order.id,
                        parts: order.parts,
                        orderDate: order.orderDate,
                        status: order.status,
                        totalAmount: order.totalAmount
                    }))
            })),
        warranty: warrantyPart.warranty.map(warranty =>
            WarrantyEntity.reconstitute({
                id: warranty.id,
                startDate: warranty.startDate,
                endDate: warranty.endDate,
                type: warranty.type,
                motorcycle: warranty.motorcycle.map(motorcycle =>
                    MotorcycleEntity.reconstitute({
                        id: motorcycle.id,
                        dealerId: motorcycle.dealerId,
                        brand: motorcycle.brand,
                        model: motorcycle.model,
                        year: motorcycle.year,
                        registrationNumber: motorcycle.registrationNumber,
                        status: motorcycle.status,
                        clientId: motorcycle.clientId,
                        drivers: motorcycle.drivers ? motorcycle.drivers.map(driver =>
                            DriverEntity.reconstitute({
                                id: driver.id,
                                enterpriseId: driver.enterpriseId,
                                motorcycleId: driver.motorcycleId,
                                firstname: driver.firstname,
                                lastname: driver.lastname,
                                licenseNumber: driver.licenseNumber,
                                phoneNumber: driver.phoneNumber,
                                emailAddress: driver.emailAddress
                            })
                        ) : null,
                        enterpriseId: motorcycle.enterpriseId
                    })),
                terms: warranty.terms
            })),
        coveredCost: warrantyPart.coveredCost,
        remainingCost: warrantyPart.remainingCost
      });
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.warranty.delete({
      where: { id }
    });
  }
}
