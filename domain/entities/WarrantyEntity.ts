import type { MotorcycleEntity } from "./MotorcycleEntity.ts";

export class WarrantyEntity {
  private constructor(
    public readonly identifier: string,
    public readonly startDate: Date, 
    public readonly endDate: Date, 
    public readonly warrantyType: string,
    public readonly motorcycle: MotorcycleEntity,
    public readonly terms: string,
  ) {}

  public static create(startDate: Date, endDate: Date, motorcycle: MotorcycleEntity, warrantyType: string, terms: string) {
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