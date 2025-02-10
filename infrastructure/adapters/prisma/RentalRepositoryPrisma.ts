import { PrismaClient } from "../../../infrastructure/database/prisma/generated/client-deno/deno/edge.ts";
import { RentalRepository } from "../../../application/repositories/RentalRepository.ts";
import { RentalEntity } from "../../../domain/entities/RentalEntity.ts";
import { DriverEntity } from "../../../domain/entities/DriverEntity.ts";
import { ClientEntity } from "../../../domain/entities/ClientEntity.ts";
import { MotorcycleEntity } from "../../../domain/entities/MotorcycleEntity.ts";
import { UserEntity } from "../../../domain/entities/UserEntity.ts";
import { RentalNotFoundError } from "../../../domain/errors/RentalNotFoundError.ts";

export class RentalRepositoryPrisma implements RentalRepository {
  public constructor(private prisma: PrismaClient) {}

  public async save(rental: RentalEntity): Promise<void> {
    await this.prisma.rental.create({
      data: {
        id: rental.id,
        client: rental.client,
        motorcycle: rental.motorcycle,
        startDate: rental.startDate,
        endDate: rental.endDate,
        cost: rental.cost,
        isCompleted: rental.isCompleted
      }
    });
  }

  public async findAll(): Promise<RentalEntity[]> {
    const rentals = await this.prisma.rental.findMany();

    return rentals.map(rental =>
      RentalEntity.reconstitute({
        id: rental.id,
        client: rental.client.map(client =>
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
                        token: user.token
                    })),
                dealerId: client.dealerId
            })),
        motorcycle: rental.motorcycle.map(motorcycle =>
            MotorcycleEntity.reconstitute({
                id: motorcycle.id,
                dealerId: motorcycle.dealerId,
                brand: motorcycle.brand,
                model: motorcycle.model,
                year: motorcycle.year,
                registrationNumber: motorcycle.registrationNumber,
                status: motorcycle.status,
                clientId: motorcycle.clientId,
                drivers: motorcycle.drivers.map(driver =>
                    DriverEntity.reconstitute({
                        id: driver.id,
                        enterpriseId: driver.enterpriseId,
                        motorcycleId: driver.motorcycleId,
                        firstname: driver.firstname,
                        lastname: driver.lastname,
                        licenseNumber: driver.licenseNumber,
                        phoneNumber: driver.phoneNumber,
                        emailAddress: driver.emailAddress
                    })),
                enterpriseId: motorcycle.enterpriseId
            })),
        startDate: rental.startDate,
        endDate: rental.endDate,
        cost: rental.cost,
        isCompleted: rental.isCompleted
      })
    );
  }

  public async findOneById(id: string): Promise<RentalEntity | RentalNotFoundError> {
    const rental = await this.prisma.rental.findUnique({
      where: { id }
    });

    if (!rental) {
      return new RentalNotFoundError();
    }

    return RentalEntity.reconstitute({
        id: rental.id,
        client: rental.client.map(client =>
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
                        token: user.token
                    })),
                dealerId: client.dealerId
            })),
        motorcycle: rental.motorcycle.map(motorcycle =>
            MotorcycleEntity.reconstitute({
                id: motorcycle.id,
                dealerId: motorcycle.dealerId,
                brand: motorcycle.brand,
                model: motorcycle.model,
                year: motorcycle.year,
                registrationNumber: motorcycle.registrationNumber,
                status: motorcycle.status,
                clientId: motorcycle.clientId,
                drivers: motorcycle.drivers.map(driver =>
                    DriverEntity.reconstitute({
                        id: driver.id,
                        enterpriseId: driver.enterpriseId,
                        motorcycleId: driver.motorcycleId,
                        firstname: driver.firstname,
                        lastname: driver.lastname,
                        licenseNumber: driver.licenseNumber,
                        phoneNumber: driver.phoneNumber,
                        emailAddress: driver.emailAddress
                    })),
                enterpriseId: motorcycle.enterpriseId
            })),
        startDate: rental.startDate,
        endDate: rental.endDate,
        cost: rental.cost,
        isCompleted: rental.isCompleted
      });
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.rental.delete({
      where: { id }
    });
  }
}
