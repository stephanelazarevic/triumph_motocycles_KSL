import type { MotorcycleEntity } from "./MotorcycleEntity.ts";
import type { IncidentType } from "../enum/IncidentEnum.ts";
import { Entity } from "./Entity.ts";

export class IncidentEntity extends Entity {
  private constructor(
    public description: string,
    public motorcycle: MotorcycleEntity,
    public type: IncidentType,
    public reportDate: Date,
    public resolutionDate: Date,
    public status: string,
  ) {
    super();
  }

  public static create( params: {
    description: string;
    motorcycle: MotorcycleEntity;
    type: IncidentType;
    reportDate: Date;
    resolutionDate: Date;
    status: string;
  }) {
    return new IncidentEntity(
      params.description,
      params.motorcycle,
      params.type,
      params.reportDate,
      params.resolutionDate,
      params.status,
    );
  }
}
