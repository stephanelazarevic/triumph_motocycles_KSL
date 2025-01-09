import type { AppointmentRepository } from "../../../application/repositories/AppointmentRepository.ts";
import type { AppointmentEntity } from "../../../domain/entities/AppointmentEntity.ts";

export class AppointmentRepositoryInMemory implements AppointmentRepository {
  public constructor(private readonly appointments: AppointmentEntity[]) {}

  public save(appointment: AppointmentEntity): Promise<void> {
    this.appointments.push(appointment);

    return Promise.resolve();
  }

  public all(): Promise<AppointmentEntity[]> {
    return Promise.resolve(this.appointments);
  }
}
