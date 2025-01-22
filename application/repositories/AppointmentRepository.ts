import type { AppointmentEntity } from "../../domain/entities/AppointmentEntity.ts";

export interface AppointmentRepository {
  save(appointment: AppointmentEntity): Promise<void>;
  all(): Promise<AppointmentEntity[]>;
}
