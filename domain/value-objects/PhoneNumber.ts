import { PhoneNumberInvalidError } from "../errors/PhoneNumberInvalidError.ts";
import { PhoneNumberService } from "../services/PhoneNumberService.ts";

export class PhoneNumber {
  private static phoneNumberService: PhoneNumberService;

  private constructor(
    private readonly countryCode: string,
    private readonly nationalNumber: string
  ) {}

  public static from(phoneNumberValue: string): PhoneNumber | Error {
    if (!PhoneNumber.isValidPhoneNumber(phoneNumberValue)) {
      return new PhoneNumberInvalidError();
    }

    const countryCode = PhoneNumber.phoneNumberService.extractCountryCode(phoneNumberValue);
    const nationalNumber = PhoneNumber.phoneNumberService.extractNumber(phoneNumberValue);

    return new PhoneNumber(countryCode, nationalNumber)
  }

  private static isValidPhoneNumber(phoneNumber: string): boolean {
    const formattedPhone = PhoneNumber.phoneNumberService.formatInternational(phoneNumber);
    return PhoneNumber.phoneNumberService.isValid(formattedPhone)
  }

  public getValue(): string {
    return this.countryCode + this.nationalNumber;
  }

  public getInternational(): string {
    return PhoneNumber.phoneNumberService.formatInternational(this.getValue())
  }

  public getNational(): string {
    return PhoneNumber.phoneNumberService.formatNational(this.getValue())
  }

  public equals(phoneNumber: PhoneNumber): boolean {
    return this.getInternational() === phoneNumber.getInternational();
  }
}
