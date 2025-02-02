import { Entity } from "./Entity.ts";
import { MotorcycleEntity } from "./MotorcycleEntity.ts";

export class MaintenanceEntity extends Entity {
  private constructor(
    public readonly date: Date,
    public readonly description: string,
    public readonly motorcycle: MotorcycleEntity,
    public readonly cost: number,
  ) {
    super();
  }

  public static create( params: {
    date: Date;
    description: string;
    motorcycle: MotorcycleEntity;
    cost: number;
  }) {
    return new MaintenanceEntity(
      params.date,
      params.description,
      params.motorcycle,
      params.cost,
    );
  }
}
