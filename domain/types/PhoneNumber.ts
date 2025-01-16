import { PhoneNumberInvalidError } from "domain/errors/PhoneNumberInvalidError.ts";
import { PhoneNumberService } from "domain/services/PhoneNumberService.ts";

export class PhoneNumber {
  private static phoneNumberService: PhoneNumberService;

  private constructor(public readonly value: string) {}

  public static from(phoneNumberValue: string): PhoneNumber | Error {
    const formattedPhone =
      PhoneNumber.phoneNumberService.formatInternational(phoneNumberValue);

    if (
      !formattedPhone ||
      !PhoneNumber.phoneNumberService.isValid(formattedPhone)
    ) {
      return new PhoneNumberInvalidError();
    }

    return new PhoneNumber(formattedPhone);
  }
}
