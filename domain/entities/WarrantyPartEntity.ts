import { Entity } from "./Entity.ts";
import { WarrantyEntity } from "./WarrantyEntity.ts";
import { PartEntity } from "./PartEntity.ts";

export class WarrantyPartEntity extends Entity {
  private constructor(
    public part: PartEntity,
    public warranty: WarrantyEntity,
    public coveredCost: number,
    public remainingCost: number,
    id?: string
  ) {
    super(id);
  }

  public static create( params: {
    part: PartEntity;
    warranty: WarrantyEntity;
    coveredCost: number;
    remainingCost: number;
  }) {
    return new WarrantyPartEntity(
      params.part,
      params.warranty,
      params.coveredCost,
      params.remainingCost,
    );
  }

  static reconstitute(data: {
    id: string;
    part: PartEntity;
    warranty: WarrantyEntity;
    coveredCost: number;
    remainingCost: number;
  }): WarrantyPartEntity {
    return new WarrantyPartEntity(
      data.part,
      data.warranty,
      data.coveredCost,
      data.remainingCost,
      data.id
    );
  }
}
