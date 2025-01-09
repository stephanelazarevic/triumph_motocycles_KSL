import type { Brand } from "../types/Brand.ts";
import type { Model } from "../types/Model.ts";

export class MotorcycleEntity {
  private constructor(
    public readonly identifier: string,
    public readonly brand: Brand,
    public readonly model: Model,
    public readonly year: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  public static create(brand: Brand, model: Model, year: number) {
    const identifier = crypto.randomUUID();
    const createdAt = new Date();
    const updatedAt = new Date();

    return new MotorcycleEntity(
      identifier,
      brand,
      model,
      year,
      createdAt,
      updatedAt,
    );
  }
}
