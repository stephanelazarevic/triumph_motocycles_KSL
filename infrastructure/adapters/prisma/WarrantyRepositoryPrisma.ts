import { PrismaClient } from "../../database/prisma/generated/client-deno/deno/edge.ts";
import { WarrantyRepository } from "../../../application/repositories/WarrantyRepository.ts";
import { WarrantyNotFoundError } from "../../../domain/errors/WarrantyNotFoundError.ts";
import { WarrantyEntity } from "../../../domain/entities/WarrantyEntity.ts";
import { MotorcycleEntity } from "../../../domain/entities/MotorcycleEntity.ts";
import { DriverEntity } from "../../../domain/entities/DriverEntity.ts";

export class WarrantyRepositoryPrisma implements WarrantyRepository {
  public constructor(private prisma: PrismaClient) {}

  public async save(warranty: WarrantyEntity): Promise<void> {
    await this.prisma.warranty.create({
      data: {
        id: warranty.id,
        startDate: warranty.startDate,
        endDate: warranty.endDate,
        type: warranty.type,
        motorcycle: warranty.motorcycle,
        terms: warranty.terms
      }
    });
  }

  public async findAll(): Promise<WarrantyEntity[]> {
    const warranties = await this.prisma.warranty.findMany();

    return warranties.map(warranty =>
      WarrantyEntity.reconstitute({
        id: warranty.id,
        startDate: warranty.startDate,
        endDate: warranty.endDate,
        type: warranty.type,
        motorcycle: warranty.motorcycle.map(motorcycle => 
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
              })),
        terms: warranty.terms
      })
    );
  }

  public async findOneById(id: string): Promise<WarrantyEntity | WarrantyNotFoundError> {
    const warranty = await this.prisma.warranty.findUnique(
        { where: { id } }
    );

    if (!warranty) {
      return new WarrantyNotFoundError();
    }

    return WarrantyEntity.reconstitute({
      id: warranty.id,
      startDate: warranty.startDate,
      endDate: warranty.endDate,
      type: warranty.type,
      motorcycle: warranty.motorcycle.map(motorcycle => 
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
            })),
      terms: warranty.terms
    });
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.warranty.delete({
      where: { id }
    });
  }
}
