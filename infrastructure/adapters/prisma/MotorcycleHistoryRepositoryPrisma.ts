import { PrismaClient } from "../../database/prisma/generated/client-deno/deno/edge.ts";
import { MotorcycleHistoryRepository } from "../../../application/repositories/MotorcycleHistoryRepository.ts";
import { MotorcycleHistoryEntity } from "../../../domain/entities/MotorcycleHistoryEntity.ts";
import { DriverEntity } from "../../../domain/entities/DriverEntity.ts";
import { MotorcycleEntity } from "../../../domain/entities/MotorcycleEntity.ts";
import { IncidentEntity } from "../../../domain/entities/IncidentEntity.ts";
import { mapMotorcycleStatusToPrismaMotorcycleStatus } from "./mappers/MotorcycleMapper.ts";
import { mapIncidentTypeToPrismaIncidentType } from "./mappers/IncidentMapper.ts";
import { MaintenanceEntity } from "../../../domain/entities/MaintenanceEntity.ts";
import { MotorcycleHistoryNotFoundError } from "../../../domain/errors/MotorcycleHistoryNotFoundError.ts";

export class MotorcycleHistoryRepositoryPrisma implements MotorcycleHistoryRepository {
  public constructor(private prisma: PrismaClient) {}

  public async save(motorcycleHistory: MotorcycleHistoryEntity): Promise<void> {
    await this.prisma.motorcycleHistory.upsert({
      where: {
        id: motorcycleHistory.id,
      },
      create: {
        motorcycleId: motorcycleHistory.motorcycleId,
        startDate: motorcycleHistory.startDate,
        endDate: motorcycleHistory.endDate,
        incidents: motorcycleHistory.incidents.map(incident => {
          IncidentEntity.reconstitute({
            id: incident.id,
            description: incident.description,
            motorcycle: null,
            type: incident.type,
            reportDate: incident.reportDate,
            resolutionDate: incident.resolutionDate,
            status: incident.status,
          })
        }),
        maintenances: motorcycleHistory.maintenances,
        clientId: motorcycleHistory.clientId,
        drivers: motorcycleHistory.drivers,
        enterpriseId: motorcycleHistory.enterpriseId
      },
      update: {
        id: motorcycleHistory.id,
        motorcycleId: motorcycleHistory.motorcycleId,
        startDate: motorcycleHistory.startDate,
        endDate: motorcycleHistory.endDate,
        incidents: motorcycleHistory.incidents,
        maintenances: motorcycleHistory.maintenances,
        clientId: motorcycleHistory.clientId,
        drivers: motorcycleHistory.drivers,
        enterpriseId: motorcycleHistory.enterpriseId
      }
    });
  }

  public async findAll(): Promise<MotorcycleHistoryEntity[]> {
    const motorcyclesHistories = await this.prisma.motorcycleHistory.findMany();

  return motorcyclesHistories.map(motorcycleHistory =>
      MotorcycleHistoryEntity.reconstitute({
          id: motorcycleHistory.id,
          motorcycleId: motorcycleHistory.motorcycleId,
          startDate: motorcycleHistory.startDate,
          endDate: motorcycleHistory.endDate,
          incidents: motorcycleHistory.incidents.map(incident =>
              IncidentEntity.reconstitute({
                  id: incident.id,
                  description: incident.description,
                  motorcycle: incident.motorcycle.map(motorcycle =>
                      MotorcycleEntity.reconstitute({
                          id: motorcycle.id,
                          dealerId: motorcycle.dealerId,
                          brand: motorcycle.brand,
                          model: motorcycle.model,
                          year: motorcycle.year,
                          registrationNumber: motorcycle.registrationNumber,
                          status: mapMotorcycleStatusToPrismaMotorcycleStatus(motorcycle.status),
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
                  type: mapIncidentTypeToPrismaIncidentType(incident.type),
                  reportDate: incident.reportDate,
                  resolutionDate: incident.resolutionDate,
                  status: incident.status
              })),
          maintenances: motorcycleHistory.maintenances.map(maintenance =>
              MaintenanceEntity.reconstitute({
                  id: maintenance.id,
                  date: maintenance.date,
                  description: maintenance.description,
                  motorcycle: maintenance.motorcycle,
                  cost: maintenance.cost,
                  type: maintenance.type,
                  status: maintenance.status,
                  nextMaintenanceDate: maintenance.nextMaintenanceDate
              })),
          clientId: motorcycleHistory.clientId,
          drivers: motorcycleHistory.drivers.map(driver =>
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
          enterpriseId: motorcycleHistory.enterpriseId
      })
    );
  }

  public async findOneById(id: string): Promise<MotorcycleHistoryEntity | MotorcycleHistoryNotFoundError> {
    const motorcycleHistory = await this.prisma.motorcycleHistory.findUnique({
      where: { id }
    });

    if (!motorcycleHistory) {
      return new MotorcycleHistoryNotFoundError();
    }

    return MotorcycleHistoryEntity.reconstitute({
      id: motorcycleHistory.id,
      motorcycleId: motorcycleHistory.motorcycleId,
      startDate: motorcycleHistory.startDate,
      endDate: motorcycleHistory.endDate,
      incidents: motorcycleHistory.incidents.map(incident =>
          IncidentEntity.reconstitute({
              id: incident.id,
              description: incident.description,
              motorcycle: incident.motorcycle.map(motorcycle =>
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
              type: mapIncidentTypeToPrismaIncidentType(incident.type),
              reportDate: incident.reportDate,
              resolutionDate: incident.resolutionDate,
              status: incident.status
          })),
      maintenances: motorcycleHistory.maintenances.map(maintenance =>
          MaintenanceEntity.reconstitute({
              id: maintenance.id,
              date: maintenance.date,
              description: maintenance.description,
              motorcycle: maintenance.motorcycle,
              cost: maintenance.cost,
              type: maintenance.type,
              status: maintenance.status,
              nextMaintenanceDate: maintenance.nextMaintenanceDate
          })),
      clientId: motorcycleHistory.clientId,
      drivers: motorcycleHistory.drivers.map(driver =>
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
      enterpriseId: motorcycleHistory.enterpriseId
  });
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.motorcycleHistory.delete({
      where: { id }
    });
  }

  public async findByMotorcycleId(id: string): Promise<MotorcycleHistoryEntity[]> {
    const motorcyclesHistories = await this.prisma.motorcycleHistory.findMany({
      where: { motorcycleId: id }
    });
    return motorcyclesHistories.map(motorcycleHistory =>
        MotorcycleEntity.reconstitute({
            id: motorcycleHistory.id,
            dealerId: motorcycleHistory.dealerId,
            brand: motorcycleHistory.brand,
            model: motorcycleHistory.model,
            year: motorcycleHistory.year,
            registrationNumber: motorcycleHistory.registrationNumber,
            status: motorcycleHistory.status,
            clientId: motorcycleHistory.clientId,
            drivers: motorcycleHistory.drivers ? motorcycleHistory.drivers.map(driver =>
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
            enterpriseId: motorcycleHistory.enterpriseId

        })
    );
  }

  public async findLastByMotorcycleId(id: string): Promise<MotorcycleHistoryEntity | MotorcycleHistoryNotFoundError> {
    const lastMotorcycleHistory = await this.prisma.motorcycleHistory.findFirst({
      where: {
        motorcycleId: id,
      },
    });

    console.log("PRUOT", lastMotorcycleHistory);
    if (!lastMotorcycleHistory) {
      return new MotorcycleHistoryNotFoundError();
    }

    return MotorcycleHistoryEntity.reconstitute({
      id: lastMotorcycleHistory.id,
      motorcycleId: lastMotorcycleHistory.motorcycleId,
      startDate: lastMotorcycleHistory.startDate,
      endDate: lastMotorcycleHistory.endDate,
      incidents: lastMotorcycleHistory.incidents,
      maintenances: lastMotorcycleHistory.maintenances,
      clientId: lastMotorcycleHistory.clientId,
      drivers: lastMotorcycleHistory.drivers,
      enterpriseId: lastMotorcycleHistory.enterpriseId
    })
  }
}
