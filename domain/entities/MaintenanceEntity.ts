import { Entity } from "./Entity.ts";
import { MaintenanceType, MaintenanceStatus } from "../enum/MaintenanceEnum.ts";
import { MotorcycleEntity } from "./MotorcycleEntity.ts";

export class MaintenanceEntity extends Entity {
  private constructor(
    public date: Date,
    public description: string,
    public motorcycle: MotorcycleEntity,
    public cost: number,
    public type: MaintenanceType,
    public status: MaintenanceStatus,
    public nextMaintenanceDate: Date,
  ) {
    super();
  }

  public static create( params: {
    date: Date;
    description: string;
    motorcycle: MotorcycleEntity;
    cost: number;
    type: MaintenanceType;
    status: MaintenanceStatus;
    nextMaintenanceDate: Date,
  }) {
    return new MaintenanceEntity(
      params.date,
      params.description,
      params.motorcycle,
      params.cost,
      params.type,
      params.status,
      params.date
    );
  }

  static reconstitute(data: {
    id: string;
    date: Date;
    description: string;
    motorcycle: MotorcycleEntity;
    cost: number;
    type: string;
    status: string;
    nextMaintenanceDate: Date,
  }): MaintenanceEntity {
    return new MaintenanceEntity(
      data.date,
      data.description,
      data.motorcycle,
      data.cost,
      MaintenanceType[data.type],
      MaintenanceStatus[data.status],
      data.nextMaintenanceDate,
      data.id
    );
  }
}
