import type { AppointmentRepository } from "../repositories/AppointmentRepository.ts";

export class ListAppointmentsUsecase {
  public constructor(
    private readonly appointmentRepository: AppointmentRepository,
  ) {}

  public execute() {
    return this.appointmentRepository.all();
  }
}
