import { Brand } from "../value-objects/Brand.ts";
import { Model } from "../value-objects/Model.ts";
import { Entity } from "./Entity.ts";

export class MotorcycleEntity extends Entity{
  private constructor(
    public readonly brand: Brand,
    public readonly model: Model,
    public readonly year: number,
  ) {
    super();
  }

  public static create( params: {
    brand: Brand;
    model: Model;
    year: number;
  }) {
    return new MotorcycleEntity(
      params.brand,
      params.model,
      params.year
    );
  }
}
