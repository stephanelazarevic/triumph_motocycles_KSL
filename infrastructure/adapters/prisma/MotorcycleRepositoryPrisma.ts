import { PrismaClient } from "../../../infrastructure/database/prisma/generated/client-deno/deno/edge.ts";
import { MotorcycleRepository } from "../../../application/repositories/MotorcycleRepository.ts";
import { MotorcycleEntity } from "../../../domain/entities/MotorcycleEntity.ts";
import { DriverEntity } from "../../../domain/entities/DriverEntity.ts";
import { MotorcycleNotFoundError } from "../../../domain/errors/MotorcycleNotFoundError.ts";
import { mapMotorcycleStatusToPrismaMotorcycleStatus } from "./mappers/MotorcycleMapper.ts";

export class MotorcycleRepositoryPrisma implements MotorcycleRepository {
  public constructor(private prisma: PrismaClient) {}

  public async save(motorcycle: MotorcycleEntity): Promise<void> {
    await this.prisma.motorcycle.create({
      data: {
        id: motorcycle.id,
        dealerId: motorcycle.dealerId,
        enterpriseId: motorcycle.enterpriseId,
        clientId: motorcycle.clientId,
        brand: motorcycle.brand.getValue(),
        model: motorcycle.model.getValue(),
        year: motorcycle.year,
        registrationNumber: motorcycle.registrationNumber,
        status: mapMotorcycleStatusToPrismaMotorcycleStatus(motorcycle.status),
        drivers: {
          connect: motorcycle.drivers?.map(driver => ({ id: driver.id })) || []
        },
      }
    });
  }

  public async findAll(): Promise<MotorcycleEntity[]> {
    const motorcycles = await this.prisma.motorcycle.findMany({
      include: {
        drivers: true
      }
    });

    return motorcycles.map(motorcycle =>
      MotorcycleEntity.reconstitute({
        id: motorcycle.id,
        dealerId: motorcycle.dealerId,
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
        brand: motorcycle.brand,
        model: motorcycle.model,
        year: motorcycle.year,
        registrationNumber: motorcycle.registrationNumber,
        status: motorcycle.status,
        enterpriseId: motorcycle.enterpriseId
      })
    );
  }

  public async findOneById(id: string): Promise<MotorcycleEntity | MotorcycleNotFoundError> {
    const motorcycle = await this.prisma.motorcycle.findUnique({
      where: { id },
      include: {
        drivers: true
      }
    });

    if (!motorcycle) {
      return new MotorcycleNotFoundError();
    }

    return MotorcycleEntity.reconstitute({
      id: motorcycle.id,
      dealerId: motorcycle.dealerId,
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
      brand: motorcycle.brand,
      model: motorcycle.model,
      year: motorcycle.year,
      registrationNumber: motorcycle.registrationNumber,
      status: motorcycle.status,
      enterpriseId: motorcycle.enterpriseId
    });
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.motorcycle.delete({
      where: { id }
    });
  }
}
