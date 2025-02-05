import { Entity } from "./Entity.ts";
import type { DealerEntity } from "./DealerEntity.ts";
import { PartInvalidStockQuantityError } from "../errors/PartInvalidStockQuantityError.ts"

export class PartEntity extends Entity {

  private _stockQuantity: number;

  private constructor(
    public dealer: DealerEntity,
    public reference: string,
    public type: string,
    public price: number,
    stockQuantity: number,
  ) {
    super();
    this.stockQuantity = stockQuantity;
  }

  get stockQuantity(): number {
    return this._stockQuantity;
  }

  set stockQuantity(value: number) {
    if (!Number.isInteger(value) || value < 0) {
      throw new PartInvalidStockQuantityError()
    }
    this._stockQuantity = value;
  }

  public static create( params: {
    dealer: DealerEntity,
    reference: string;
    type: string;
    price: number;
    stockQuantity: number;
  }) {
    return new PartEntity(
      params.dealer,
      params.reference,
      params.type,
      params.price,
      params.stockQuantity,
    );
  }
}
