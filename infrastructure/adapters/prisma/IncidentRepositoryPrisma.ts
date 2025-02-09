import { PrismaClient } from "../../database/prisma/generated/client-deno/deno/edge.ts";
import { IncidentRepository } from "../../../application/repositories/IncidentRepository.ts";
import { IncidentNotFoundError } from "../../../domain/errors/IncidentNotFoundError.ts";
import { IncidentEntity } from "../../../domain/entities/IncidentEntity.ts";
import { mapIncidentTypeToPrismaIncidentType } from "./mappers/IncidentMapper.ts";
import { MotorcycleEntity } from "../../../domain/entities/MotorcycleEntity.ts";
import { DriverEntity } from "../../../domain/entities/DriverEntity.ts";

export class IncidentRepositoryPrisma implements IncidentRepository {
  public constructor(private prisma: PrismaClient) {}

  public async save(incident: IncidentEntity): Promise<void> {
    await this.prisma.incident.create({
      data: {
        id: incident.id,
        description: incident.description,
        motorcycle: incident.motorcycle,
        type: mapIncidentTypeToPrismaIncidentType(incident.type),
        reportDate: incident.reportDate,
        resolutionDate: incident.resolutionDate,
        status: incident.status,
      }
    });
  }

  public async findAll(): Promise<IncidentEntity[]> {
    const incidents = await this.prisma.incident.findMany();

    return incidents.map(incident =>
      IncidentEntity.reconstitute({
        id: incident.id,
        description: incident.description,
        motorcycle: incident.motorcycle.map(motorcycle => 
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
                brand: motorcycle.brand.getValue(),
                model: motorcycle.model.getValue(),
                year: motorcycle.year,
                registrationNumber: motorcycle.registrationNumber,
                status: motorcycle.status,
                enterpriseId: motorcycle.enterpriseId
              })
        ),
        type: incident.type,
        reportDate: incident.reportDate,
        resolutionDate: incident.resolutionDate,
        status: incident.status,
      })
    );
  }

  public async findOneById(id: string): Promise<IncidentEntity | IncidentNotFoundError> {
    const incident = await this.prisma.incident.findUnique(
        { where: { id } }
    );

    if (!incident) {
      return new IncidentNotFoundError();
    }

    return IncidentEntity.reconstitute({
      id: incident.id,
      description: incident.description,
      motorcycle: incident.motorcycle.map(motorcycle => 
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
      ),
      type: incident.type,
      reportDate: incident.reportDate,
      resolutionDate: incident.resolutionDate,
      status: incident.status,
    });
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.incident.delete({
      where: { id }
    });
  }
}
