import { Entity } from "./Entity.ts";
import { MaintenanceType, MaintenanceStatus } from "../enum/MaintenanceEnum.ts";

export class MaintenanceEntity extends Entity {
  private constructor(
    public date: Date,
    public description: string,
    public motorcycleId: string,
    public cost: number,
    public type: MaintenanceType,
    public status: MaintenanceStatus,
    public nextMaintenanceDate: Date,
    id?: string
  ) {
    super(id);
  }

  public static create( params: {
    date: Date;
    description: string;
    motorcycleId: string;
    cost: number;
    type: MaintenanceType;
    status: MaintenanceStatus;
    nextMaintenanceDate: Date,
  }) {
    return new MaintenanceEntity(
      params.date,
      params.description,
      params.motorcycleId,
      params.cost,
      params.type,
      params.status,
      params.date
    );
  }
}
