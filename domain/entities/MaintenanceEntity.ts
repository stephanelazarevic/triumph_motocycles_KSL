import { MotorcycleEntity } from "./MotorcycleEntity.ts";

export class MaintenanceEntity {
  private constructor(
    public readonly identifier: string,
    public readonly date: Date,
    public readonly description: string,
    public readonly motorcycle: MotorcycleEntity,
    public readonly cost: number
  ) {}

  public static create(
    date: Date,
    description: string,
    motorcycle: MotorcycleEntity,
    cost: number
  ) {
    const identifier = crypto.randomUUID();

    return new MaintenanceEntity(
      identifier,
      date,
      description,
      motorcycle,
      cost
    );
  }
}
