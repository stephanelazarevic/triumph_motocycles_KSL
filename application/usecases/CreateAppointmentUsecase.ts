import { AppointmentEntity } from "../../domain/entities/AppointmentEntity.ts";
import { MotorcycleNotFoundError } from "../../domain/errors/MotorcycleNotFoundError.ts";
import { AppointmentDate } from "../../domain/types/AppointmentDate.ts";
import type { AppointmentRepository } from "../repositories/AppointmentRepository.ts";
import type { MotorcycleRepository } from "../repositories/MotorcycleRepository.ts";

export class CreateAppointmentUsecase {
  public constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly motorcycleRepository: MotorcycleRepository,
  ) {}

  public async execute(date: Date, motorcycleId: string) {
    const motorcycle = await this.motorcycleRepository.findOneById(
      motorcycleId,
    );

    if (!motorcycle) {
      return new MotorcycleNotFoundError();
    }

    const appointmentDateOrError = AppointmentDate.from(date);

    if (appointmentDateOrError instanceof Error) {
      return appointmentDateOrError;
    }

    const appointment = AppointmentEntity.create(
      appointmentDateOrError,
      motorcycle,
    );

    await this.appointmentRepository.save(appointment);
  }
}
