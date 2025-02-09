import type { MotorcycleEntity } from "./MotorcycleEntity.ts";
import { IncidentType } from "../enum/IncidentEnum.ts";
import { Entity } from "./Entity.ts";

export class IncidentEntity extends Entity {
  private constructor(
    public description: string,
    public motorcycle: MotorcycleEntity,
    public type: IncidentType,
    public reportDate: Date,
    public resolutionDate: Date | null,
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

  static reconstitute(data: {
    id: string;
    description: string;
    motorcycle: MotorcycleEntity;
    type: string;
    reportDate: Date;
    resolutionDate: Date;
    status: string;
  }): IncidentEntity {
    return new IncidentEntity(
      data.description,
      data.motorcycle,
      IncidentType[data.type],
      data.reportDate,
      data.resolutionDate,
      data.status,
      data.id
    );
  }
}
