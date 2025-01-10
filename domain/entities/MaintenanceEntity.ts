import type { AppointmentDate } from "../types/AppointmentDate.ts";
import type { MotorcycleEntity } from "./MotorcycleEntity.ts";

export class MaintenanceEntity {
  private constructor(
    public readonly identifier: string,
    public readonly date: AppointmentDate, 
    public readonly description: string,
    public readonly motorcycle: MotorcycleEntity,
    public readonly cost: number,
  ) {}

  public static create(date: AppointmentDate, description: string, motorcycle: MotorcycleEntity, cost: number) {
      const identifier = crypto.randomUUID();
  
      return new MaintenanceEntity(
        identifier,
        date,
        description,
        motorcycle,
        cost,
      );
    }
}    