import type { MotorcycleEntity } from "./MotorcycleEntity.ts";
import type { BreakdownType } from "../enum/BreakdownEnum.ts";

export class BreakdownEntity {
  private constructor(
    public readonly identifier: string,
    public readonly description: string,
    public readonly motorcycle: MotorcycleEntity,
    public readonly type: BreakdownType,
    public readonly reportDate: Date,
    public readonly resolutionDate: Date,
    public readonly status: string,
  ) {}

  public static create(
    description: string,
    motorcycle: MotorcycleEntity,
    type: BreakdownType,
    reportDate: Date,
    resolutionDate: Date,
    status: string,
  ) {
    const identifier = crypto.randomUUID();

    return new BreakdownEntity(
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
