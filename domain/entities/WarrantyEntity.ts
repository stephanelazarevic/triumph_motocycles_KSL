import { Entity } from "./Entity.ts";
import type { MotorcycleEntity } from "./MotorcycleEntity.ts";

export class WarrantyEntity extends Entity {
  private constructor(
    public startDate: Date,
    public endDate: Date,
    public type: string,
    public motorcycle: MotorcycleEntity,
    public terms: string,
    id?: string
  ) {
    super(id);
  }

  public static create( params: {
    startDate: Date;
    endDate: Date;
    motorcycle: MotorcycleEntity;
    type: string;
    terms: string;
  }) {
    return new WarrantyEntity(
      params.startDate,
      params.endDate,
      params.type,
      params.motorcycle,
      params.terms,
    );
  }

   static reconstitute(data: {
      startDate: Date;
      endDate: Date;
      type: string;
      motorcycle: MotorcycleEntity;
      terms: string;
    }): WarrantyEntity {
      return new WarrantyEntity(
        data.startDate,
        data.endDate,
        data.type,
        data.motorcycle,
        data.terms,
      );
    }
}
