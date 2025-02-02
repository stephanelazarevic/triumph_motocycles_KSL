import { Entity } from "./Entity.ts";
import type { MotorcycleEntity } from "./MotorcycleEntity.ts";

export class WarrantyEntity extends Entity {
  private constructor(
    public startDate: Date,
    public endDate: Date,
    public warrantyType: string,
    public motorcycle: MotorcycleEntity,
    public terms: string,
  ) {
    super();
  }

  public static create( params: {
    startDate: Date;
    endDate: Date;
    motorcycle: MotorcycleEntity;
    warrantyType: string;
    terms: string;
  }) {
    return new WarrantyEntity(
      params.startDate,
      params.endDate,
      params.warrantyType,
      params.motorcycle,
      params.terms,
    );
  }
}
