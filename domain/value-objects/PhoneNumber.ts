import { PhoneNumberInvalidError } from "../errors/PhoneNumberInvalidError.ts";
import { PhoneNumberService } from "../services/PhoneNumberService.ts";

export class PhoneNumber {
  private static phoneNumberService: PhoneNumberService;

  private constructor(private readonly value: string) {}

  public static from(phoneNumberValue: string): PhoneNumber | Error {
    if (!PhoneNumber.isValidPhoneNumber(phoneNumberValue)) {
      return new PhoneNumberInvalidError();
    }

    return new PhoneNumber(phoneNumberValue);
  }

  private static isValidPhoneNumber(phoneNumber: string): boolean {
    const formattedPhone = PhoneNumber.phoneNumberService.formatInternational(phoneNumber);
    return PhoneNumber.phoneNumberService.isValid(formattedPhone);
  }

  public getValue(): string {
    return this.value;
  }

  public getInternational(): string {
    return PhoneNumber.phoneNumberService.formatInternational(this.getValue());
  }

  public getNational(): string {
    return PhoneNumber.phoneNumberService.formatNational(this.getValue());
  }

  public equals(phoneNumber: PhoneNumber): boolean {
    return this.getInternational() === phoneNumber.getInternational();
  }

  public static reconstitute (value: string){
    return new PhoneNumber(value);
  }
}
