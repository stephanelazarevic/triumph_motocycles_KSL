import { PrismaClient } from "../../database/prisma/generated/client-deno/deno/edge.ts";
import { PartRepository } from "../../../application/repositories/PartRepository.ts";
import { PartEntity } from "../../../domain/entities/PartEntity.ts";
import { UserEntity } from "../../../domain/entities/UserEntity.ts";
import { DealerEntity } from "../../../domain/entities/DealerEntity.ts";
import { OrderEntity } from "../../../domain/entities/OrderEntity.ts";
import { PartNotFoundError } from "../../../domain/errors/PartNotFoundError.ts";

export class PartRepositoryPrisma implements PartRepository {
  public constructor(private prisma: PrismaClient) {}

  public async save(part: PartEntity): Promise<void> {
    await this.prisma.part.create({
      data: {
        id: part.id,
        dealer: part.dealer,
        reference: part.reference,
        type: part.type,
        price: part.price,
        stockQuantity: part.stockQuantity,
        order: part.order
      }
    });
  }

  public async findAll(): Promise<PartEntity[]> {
    const parts = await this.prisma.part.findMany();

    return parts.map(part =>
      PartEntity.reconstitute({
        id: part.id,
        dealer: part.dealer.map(dealer => DealerEntity.reconstitute({
          id: dealer.id,
          user: dealer.user.map(user => UserEntity.reconstitute({
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
        order: part.order.map(order => OrderEntity.reconstitute({
          id: order.id,
          parts: order.parts,
          orderDate: order.orderDate,
          status: order.status,
          totalAmount: order.totalAmount,
        }))
      })
    );
  }

  public async findOneById(id: string): Promise<PartEntity | PartNotFoundError> {
    const part = await this.prisma.part.findUnique({
      where: { id }
    });

    if (!part) {
      return new PartNotFoundError();
    }

    return PartEntity.reconstitute({
      id: part.id,
      dealer: part.dealer.map(dealer => DealerEntity.reconstitute({
        id: dealer.id,
        user: dealer.user.map(user => UserEntity.reconstitute({
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
      order: part.order.map(order => OrderEntity.reconstitute({
        id: order.id,
        parts: order.parts,
        orderDate: order.orderDate,
        status: order.status,
        totalAmount: order.totalAmount,
      }))
    });
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.part.delete({
      where: { id }
    });
  }

  public async findPartsBelowStock(threshold: number): Promise<PartEntity[]> {
    const parts = await this.prisma.part.findMany({
      where: { stockQuantity: { lt: threshold } }
    });
    return parts.map(part =>
      PartEntity.reconstitute({
        id: part.id,
        dealer: part.dealer.map(dealer => DealerEntity.reconstitute({
          id: dealer.id,
          user: dealer.user.map(user => UserEntity.reconstitute({
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
        order: part.order.map(order => OrderEntity.reconstitute({
          id: order.id,
          parts: order.parts,
          orderDate: order.orderDate,
          status: order.status,
          totalAmount: order.totalAmount,
        }))
      })
    );
  }
}
