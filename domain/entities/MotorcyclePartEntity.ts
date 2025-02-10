import { Entity } from "./Entity.ts";
import { MotorcycleEntity } from "./MotorcycleEntity.ts";
import { PartEntity } from "./PartEntity.ts";

export class MotorcyclePartEntity extends Entity {
  private constructor(
    public motorcycle: MotorcycleEntity,
    public part: PartEntity,
    id?: string
  ) {
    super(id);
  }

  public static create(params: {
    motorcycle: MotorcycleEntity;
    part: PartEntity;
  }): MotorcyclePartEntity {
    return new MotorcyclePartEntity(
      params.motorcycle,
      params.part,
    );
  }

  static reconstitute(data: {
    id: string;
    motorcycle: MotorcycleEntity;
    part: PartEntity;
  }): MotorcyclePartEntity {
    return new MotorcyclePartEntity(
      data.motorcycle,
      data.part,
      data.id
    );
  }
}
