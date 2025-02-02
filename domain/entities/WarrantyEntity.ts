import type { MotorcycleEntity } from "./MotorcycleEntity.ts";

export class WarrantyEntity {
  private constructor(
    public identifier: string,
    public startDate: Date,
    public endDate: Date,
    public type: string,
    public motorcycle: MotorcycleEntity,
    public terms: string,
  ) {}

  public static create(
    startDate: Date,
    endDate: Date,
    motorcycle: MotorcycleEntity,
    warrantyType: string,
    terms: string,
  ) {
    const identifier = crypto.randomUUID();

    return new WarrantyEntity(
      identifier,
      startDate,
      endDate,
      warrantyType,
      motorcycle,
      terms,
    );
  }
}
