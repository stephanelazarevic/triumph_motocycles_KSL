import { Entity } from "./Entity.ts";
import type { DealerEntity } from "./DealerEntity.ts";
import type { OrderEntity } from "./OrderEntity.ts";
import { PartInvalidStockQuantityError } from "../errors/PartInvalidStockQuantityError.ts"

export class PartEntity extends Entity {
  private constructor(
    public dealer: DealerEntity,
    public reference: string,
    public type: string,
    public price: number,
    private _stockQuantity: number,
    public order?: OrderEntity,
    id?: string
  ) {
    super(id);
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
    dealer: DealerEntity;
    reference: string;
    type: string;
    price: number;
    stockQuantity: number;
    order?: OrderEntity;
  }) {
    return new PartEntity(
      params.dealer,
      params.reference,
      params.type,
      params.price,
      params.stockQuantity,
      params.order,
    );
  }

  static reconstitute(data: {
    id: string;
    dealer: DealerEntity;
    reference: string;
    type: string;
    price: number;
    stockQuantity: number;
    order?: OrderEntity;
  }): PartEntity {
    return new PartEntity(
      data.dealer,
      data.reference,
      data.type,
      data.price,
      data.stockQuantity,
      data.order,
      data.id
    );
  }
}
