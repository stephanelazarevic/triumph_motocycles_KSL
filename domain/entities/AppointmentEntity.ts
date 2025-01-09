import type { AppointmentDate } from "../types/AppointmentDate.ts";
import type { MotorcycleEntity } from "./MotorcycleEntity.ts";

export class AppointmentEntity {
  private constructor(
    public readonly identifier: string,
    public readonly date: AppointmentDate,
    public readonly motorcycle: MotorcycleEntity,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  public static create(date: AppointmentDate, motorcycle: MotorcycleEntity) {
    const identifier = crypto.randomUUID();
    const createdAt = new Date();
    const updatedAt = new Date();

    return new AppointmentEntity(
      identifier,
      date,
      motorcycle,
      createdAt,
      updatedAt,
    );
  }
}
