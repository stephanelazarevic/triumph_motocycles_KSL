import { PrismaClient } from "../../database/prisma/generated/client-deno/deno/edge.ts";
import { MaintenanceRepository } from "../../../application/repositories/MaintenanceRepository.ts";
import { MaintenanceNotFoundError } from "../../../domain/errors/MaintenanceNotFoundError.ts";
import { MaintenanceEntity } from "../../../domain/entities/MaintenanceEntity.ts";
import { mapMaintenanceStatusToPrismaMaintenanceStatus, mapMaintenanceTypeToPrismaMaintenanceType } from "./mappers/MaintenanceMapper.ts";

export class MaintenanceRepositoryPrisma implements MaintenanceRepository {
  public constructor(private prisma: PrismaClient) {}

  public async save(maintenance: MaintenanceEntity): Promise<void> {
    await this.prisma.maintenance.create({
      data: {
        id: maintenance.id,
        date: maintenance.date,
        description: maintenance.description,
        motorcycle: maintenance.motorcycle,
        cost: maintenance.cost,
        type: mapMaintenanceTypeToPrismaMaintenanceType(maintenance.type),
        status: mapMaintenanceStatusToPrismaMaintenanceStatus(maintenance.status),  
        nextMaintenanceDate: maintenance.nextMaintenanceDate,
      }
    });
  }

  public async findAll(): Promise<MaintenanceEntity[]> {
    const maintenances = await this.prisma.maintenance.findMany();

    return maintenances.map(maintenance =>
      MaintenanceEntity.reconstitute({
        id: maintenance.id,
        date: maintenance.date,
        description: maintenance.description,
        motorcycle: maintenance.motorcycle,
        cost: maintenance.cost,
        type: maintenance.type,
        status: maintenance.status,
        nextMaintenanceDate: maintenance.nextMaintenanceDate
      })
    );
  }

  public async findOneById(id: string): Promise<MaintenanceEntity | MaintenanceNotFoundError> {
    const maintenance = await this.prisma.maintenance.findUnique(
        { where: { id } }
    );

    if (!maintenance) {
      return new MaintenanceNotFoundError();
    }

    return MaintenanceEntity.reconstitute({
      id: maintenance.id,
      date: maintenance.date,
      description: maintenance.description,
      motorcycle: maintenance.motorcycle,
      cost: maintenance.cost,
      type: maintenance.type,
      status: maintenance.status,
      nextMaintenanceDate: maintenance.nextMaintenanceDate
    });
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.maintenance.delete({
      where: { id }
    });
  }

  public async findScheduledMaintenances(date: Date): Promise<MaintenanceEntity[]> {
    const maintenances = await this.prisma.maintenance.findMany({
      where: { nextMaintenanceDate: { lte: date } }
    });
    return maintenances.map(maintenance =>
      MaintenanceEntity.reconstitute({
        id: maintenance.id,
        date: maintenance.date,
        description: maintenance.description,
        motorcycle: maintenance.motorcycle,
        cost: maintenance.cost,
        type: maintenance.type,
        status: maintenance.status,
        nextMaintenanceDate: maintenance.nextMaintenanceDate
      })
    );
  }

  public async findByMotorcycleIdAndPeriod(motorcycleId: string, startDate: Date, endDate: Date | null): Promise<MaintenanceEntity[]> {
    const maintenances = await this.prisma.maintenance.findMany({
      where: {
        motorcycleId,
        date: {
          gte: startDate,
          lte: endDate
        }
      }
    });
    return maintenances.map(maintenance =>
      MaintenanceEntity.reconstitute({
        id: maintenance.id,
        date: maintenance.date,
        description: maintenance.description,
        motorcycle: maintenance.motorcycle,
        cost: maintenance.cost,
        type: maintenance.type,
        status: maintenance.status,
        nextMaintenanceDate: maintenance.nextMaintenanceDate
      })
    );
  }
}
