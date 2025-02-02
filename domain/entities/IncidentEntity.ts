import type { MotorcycleEntity } from "./MotorcycleEntity.ts";
import type { IncidentType } from "../enum/IncidentEnum.ts";
import { Entity } from "./Entity.ts";

export class IncidentEntity extends Entity {
  private constructor(
    public readonly description: string,
    public readonly motorcycle: MotorcycleEntity,
    public readonly type: IncidentType,
    public readonly reportDate: Date,
    public readonly resolutionDate: Date,
    public readonly status: string,
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
