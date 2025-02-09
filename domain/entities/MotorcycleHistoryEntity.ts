import { DriverEntity } from "./DriverEntity.ts";
import { IncidentEntity } from "./IncidentEntity.ts";
import { MaintenanceEntity } from "./MaintenanceEntity.ts";
import { Entity } from "./Entity.ts";
import { MotorcycleCannotAssignToBothClientAndDriverError } from "../errors/MotorcycleCannotAssignToBothClientAndDriverError.ts";
import { MotorcycleCannotAssignToBothClientAndEnterpriseError } from "../errors/MotorcycleCannotAssignToBothClientAndEnterpriseError.ts";
import { MotorcycleMustHaveEnterpriseIfDriverError } from "../errors/MotorcycleMustHaveEnterpriseIfDriverError.ts";

export class MotorcycleHistoryEntity extends Entity{
  private constructor(
    public motorcycleId: string,
    public startDate: Date,
    public endDate: Date | null,
    public incidents: IncidentEntity[],
    public maintenances: MaintenanceEntity[],
    public clientId: string | null,
    public drivers: DriverEntity[] | null,
    public enterpriseId: string | null,
    id?: string
  ) {
    super(id);
  }

  public static create(params: {
    motorcycleId: string;
    startDate: Date;
    endDate: Date | null;
    incidents: IncidentEntity[];
    maintenances: MaintenanceEntity[];
    clientId: string | null;
    drivers: DriverEntity[] | null;
    enterpriseId: string | null;
  }): MotorcycleHistoryEntity | Error {

    if(params.clientId && params.drivers){
        return new MotorcycleCannotAssignToBothClientAndDriverError()
    }

    if (params.clientId && params.enterpriseId) {
        return new MotorcycleCannotAssignToBothClientAndEnterpriseError();
    }

    if (params.drivers && params.drivers.length > 0 && !params.enterpriseId) {
        return new MotorcycleMustHaveEnterpriseIfDriverError();
    }

    return new MotorcycleHistoryEntity(
      params.motorcycleId,
      params.startDate,
      params.endDate,
      params.incidents,
      params.maintenances,
      params.clientId,
      params.drivers,
      params.enterpriseId,
    );
  }

    static reconstitute(data: {
      id: string;
      motorcycleId: string;
      startDate: Date;
      endDate: Date | null;
      incidents: IncidentEntity[];
      maintenances: MaintenanceEntity[];
      clientId: string | null;
      drivers: DriverEntity[] | null;
      enterpriseId: string | null;
    }): MotorcycleHistoryEntity {
      return new MotorcycleHistoryEntity(
        data.motorcycleId,
        data.startDate,
        data.endDate,
        data.incidents,
        data.maintenances,
        data.clientId,
        data.drivers,
        data.enterpriseId,
        data.id
      );
    }
}