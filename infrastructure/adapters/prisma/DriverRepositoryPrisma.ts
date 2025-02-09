import { PrismaClient } from "../../database/prisma/generated/client-deno/deno/edge.ts";
import { DriverRepository } from "../../../application/repositories/DriverRepository.ts";
import { DriverNotFoundError } from "../../../domain/errors/DriverNotFoundError.ts";
import { DriverEntity } from "../../../domain/entities/DriverEntity.ts";

export class DriverRepositoryPrisma implements DriverRepository {
  public constructor(private prisma: PrismaClient) {}

  public async save(driver: DriverEntity): Promise<void> {
    await this.prisma.driver.create({
      data: {
        id: driver.id,
        enterpriseId: driver.enterpriseId,
        motorcycleId: driver.motorcycleId,
        firstname: driver.firstname.getValue(),
        lastname: driver.lastname.getValue(),
        licenseNumber: driver.licenseNumber,
        phoneNumber: driver.phoneNumber.getValue(),
        emailAddress: driver.emailAddress.getValue(),
      }
    });
  }

  public async findAll(): Promise<DriverEntity[]> {
    const drivers = await this.prisma.driver.findMany();

    return drivers.map(driver =>
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
    );
  }

  public async findOneById(id: string): Promise<DriverEntity | DriverNotFoundError> {
    const driver = await this.prisma.driver.findUnique(
        { where: { id } }
    );

    if (!driver) {
      return new DriverNotFoundError();
    }

    return DriverEntity.reconstitute({
      id: driver.id,
      enterpriseId: driver.enterpriseId,
      motorcycleId: driver.motorcycleId,
      firstname: driver.firstname,
      lastname: driver.lastname,
      licenseNumber: driver.licenseNumber,
      phoneNumber: driver.phoneNumber,
      emailAddress: driver.emailAddress
    });
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.driver.delete({
      where: { id }
    });
  }
}
