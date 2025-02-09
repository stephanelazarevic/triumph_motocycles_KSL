import type { ClientEntity } from "./ClientEntity.ts";
import type { MotorcycleEntity } from "./MotorcycleEntity.ts";
import { Entity } from "./Entity.ts";

export class TestRideEntity extends Entity {
  private constructor(
    public client: ClientEntity,
    public motorcycle: MotorcycleEntity,
    public date: Date,
    public feedback: string,
    public isCompleted: boolean,
    id?: string,
  ) {
    super(id);
  }

  public static create( params: {
    client: ClientEntity;
    motorcycle: MotorcycleEntity;
    date: Date;
    feedback: string;
    isCompleted: boolean;
  }) {
    return new TestRideEntity(
      params.client,
      params.motorcycle,
      params.date,
      params.feedback,
      params.isCompleted,
    );
  }
}
