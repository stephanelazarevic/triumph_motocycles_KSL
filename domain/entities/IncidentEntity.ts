import type { MotorcycleEntity } from "./MotorcycleEntity.ts";
import type { IncidentType } from "../enum/IncidentEnum.ts";

export class IncidentEntity {
  private constructor(
    public readonly identifier: string,
    public readonly description: string,
    public readonly motorcycle: MotorcycleEntity,
    public readonly type: IncidentType,
    public readonly reportDate: Date,
    public readonly resolutionDate: Date,
    public readonly status: string,
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
