import { MotorcycleEntity } from "./MotorcycleEntity.ts";

export class MaintenanceEntity {
  private constructor(
    public identifier: string,
    public date: Date,
    public description: string,
    public motorcycle: MotorcycleEntity,
    public cost: number,
  ) {}

  public static create(
    date: Date,
    description: string,
    motorcycle: MotorcycleEntity,
    cost: number,
  ) {
    const identifier = crypto.randomUUID();

    return new MaintenanceEntity(
      identifier,
      date,
      description,
      motorcycle,
      cost,
    );
  }
}
