import { PrismaClient } from "../../../infrastructure/database/prisma/generated/client-deno/deno/edge.ts";
import { TestRideRepository } from "../../../application/repositories/TestRideRepository.ts";
import { TestRideEntity } from "../../../domain/entities/TestRideEntity.ts";
import { DriverEntity } from "../../../domain/entities/DriverEntity.ts";
import { ClientEntity } from "../../../domain/entities/ClientEntity.ts";
import { MotorcycleEntity } from "../../../domain/entities/MotorcycleEntity.ts";
import { UserEntity } from "../../../domain/entities/UserEntity.ts";
import { TestRideNotFoundError } from "../../../domain/errors/TestRideNotFoundError.ts";

export class TestRideRepositoryPrisma implements TestRideRepository {
  public constructor(private prisma: PrismaClient) {}

  public async save(testRide: TestRideEntity): Promise<void> {
    await this.prisma.testRide.create({
      data: {
        id: testRide.id,
        client: testRide.client,
        motorcycle: testRide.motorcycle,
        date: testRide.date,
        feedback: testRide.feedback,
        isCompleted: testRide.isCompleted
      }
    });
  }

  public async findAll(): Promise<TestRideEntity[]> {
    const testRides = await this.prisma.testRide.findMany();

    return testRides.map(testRide =>
      TestRideEntity.reconstitute({
        id: testRide.id,
        client: testRide.client.map(client =>
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
        motorcycle: testRide.motorcycle.map(motorcycle =>
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
        date: testRide.date,
        feedback: testRide.feedback,
        isCompleted: testRide.isCompleted
      })
    );
  }

  public async findOneById(id: string): Promise<TestRideEntity | TestRideNotFoundError> {
    const testRide = await this.prisma.testRide.findUnique({
      where: { id }
    });

    if (!testRide) {
      return new TestRideNotFoundError();
    }

    return TestRideEntity.reconstitute({
        id: testRide.id,
        client: testRide.client.map(client =>
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
        motorcycle: testRide.motorcycle.map(motorcycle =>
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
        date: testRide.date,
        feedback: testRide.feedback,
        isCompleted: testRide.isCompleted
      });
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.testRide.delete({
      where: { id }
    });
  }
}
