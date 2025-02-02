import type { MotorcycleEntity } from "./MotorcycleEntity.ts";
import type { IncidentType } from "../enum/IncidentEnum.ts";

export class IncidentEntity {
  private constructor(
    public identifier: string,
    public description: string,
    public motorcycle: MotorcycleEntity,
    public type: IncidentType,
    public reportDate: Date,
    public resolutionDate: Date,
    public status: string,
  ) {}

  public static create(
    description: string,
    motorcycle: MotorcycleEntity,
    type: IncidentType,
    reportDate: Date,
    resolutionDate: Date,
    status: string,
  ) {
    const identifier = crypto.randomUUID();

    return new IncidentEntity(
      identifier,
      description,
      motorcycle,
      type,
      reportDate,
      resolutionDate,
      status,
    );
  }
}
