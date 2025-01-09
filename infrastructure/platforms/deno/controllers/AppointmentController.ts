import type { AppointmentRepository } from "../../../../application/repositories/AppointmentRepository.ts";
import type { MotorcycleRepository } from "../../../../application/repositories/MotorcycleRepository.ts";
import { CreateAppointmentUsecase } from "../../../../application/usecases/CreateAppointmentUsecase.ts";
import { ListAppointmentsUsecase } from "../../../../application/usecases/ListAppointmentsUsecase.ts";
import { exhaustive } from "npm:exhaustive";
import { createAppointmentRequestSchema } from "../schemas/createAppointmentRequestSchema.ts";

export class AppointmentController {
  public constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly motorcycleRepository: MotorcycleRepository,
  ) {}

  public async listAppointments(): Promise<Response> {
    const listAppointmentsUsecase = new ListAppointmentsUsecase(
      this.appointmentRepository,
    );

    const appointments = await listAppointmentsUsecase.execute();

    return new Response(JSON.stringify(appointments), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  public async createAppointment(request: Request): Promise<Response> {
    const createAppointmentUsecase = new CreateAppointmentUsecase(
      this.appointmentRepository,
      this.motorcycleRepository,
    );

    const body = await request.json();

    const validation = createAppointmentRequestSchema.safeParse(body);

    if (!validation.success) {
      return new Response("Malformed request", {
        status: 400,
      });
    }

    const { date, motorcycleId } = validation.data;

    const error = await createAppointmentUsecase.execute(date, motorcycleId);

    if (!error) {
      return new Response(null, {
        status: 201,
      });
    }

    return exhaustive(error.name, {
      AppointmentDatePastError: () => new Response("AppointmentDatePastError", { status: 400 }),
      MotorcycleNotFoundError: () => new Response("MotorcycleNotFoundError", { status: 400 }),
    });
  }
}
