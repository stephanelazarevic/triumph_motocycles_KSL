import { AppointmentDatePastError } from "../errors/AppointmentDatePastError.ts";

export class AppointmentDate {
  private constructor(public readonly value: Date) {}

  public static from(date: Date) {
    const today = new Date();

    if (date < today) {
      return new AppointmentDatePastError();
    }

    return new AppointmentDate(date);
  }
}
