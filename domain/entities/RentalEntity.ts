import { ClientEntity } from "./ClientEntity.ts";
import { MotorcycleEntity } from "./MotorcycleEntity.ts";
import { Entity } from "./Entity.ts";

export class RentalEntity extends Entity {
  private constructor(
    public client: ClientEntity,
    public motorcycle: MotorcycleEntity,
    public startDate: Date,
    public endDate: Date,
    public cost: number,
    public isCompleted: boolean,
    id?: string
  ) {
    super(id);
  }

  public static create( params: {
    client: ClientEntity;
    motorcycle: MotorcycleEntity;
    startDate: Date;
    endDate: Date;
    cost: number;
    isCompleted: boolean;
  }) {
    return new RentalEntity(
      params.client,
      params.motorcycle,
      params.startDate,
      params.endDate,
      params.cost,
      params.isCompleted,
    );
  }

  static reconstitute(data: {
    id: string;
    client: ClientEntity;
    motorcycle: MotorcycleEntity;
    startDate: Date;
    endDate: Date;
    cost: number;
    isCompleted: boolean;
  }): RentalEntity {
    return new RentalEntity(
      data.client,
      data.motorcycle,
      data.startDate,
      data.endDate,
      data.cost,
      data.isCompleted,
      data.id
    );
  }
}
