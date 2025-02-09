import { PhoneNumberInvalidError } from "../errors/PhoneNumberInvalidError.ts";
import { PhoneNumberService } from "../../application/services/PhoneNumberService.ts";
import { PhoneNumberData } from "../types/PhoneNumberType.ts";

export class PhoneNumber {
  private static phoneNumberService: PhoneNumberService;

  private constructor(
    private readonly countryCode: string,
    private readonly nationalNumber: string,
  ) {}

  public static from(phoneNumberValue: string): PhoneNumber | Error {
    if (!PhoneNumber.isValidPhoneNumber(phoneNumberValue)) {
      return new PhoneNumberInvalidError();
    }

    const countryCode = PhoneNumber.phoneNumberService.extractCountryCode(phoneNumberValue);
    const nationalNumber = PhoneNumber.phoneNumberService.extractNumber(phoneNumberValue);

    return new PhoneNumber(countryCode, nationalNumber);
  }

  private static isValidPhoneNumber(phoneNumber: string): boolean {
    const formattedPhone = PhoneNumber.phoneNumberService.formatInternational(phoneNumber);
    return PhoneNumber.phoneNumberService.isValid(formattedPhone);
  }

  public getValue(): PhoneNumberData {
    return {
      countryCode: this.countryCode,
      nationalNumber: this.nationalNumber
    };
  }

  public getPhoneNumber(): string {
    return this.countryCode + this.nationalNumber;
  }

  public getInternational(): string {
    return PhoneNumber.phoneNumberService.formatInternational(this.getPhoneNumber());
  }

  public getNational(): string {
    return PhoneNumber.phoneNumberService.formatNational(this.getPhoneNumber());
  }

  public equals(phoneNumber: PhoneNumber): boolean {
    return this.getInternational() === phoneNumber.getInternational();
  }

  public static reconstitute(data: PhoneNumberData): PhoneNumber {
    return new PhoneNumber(
      data.countryCode,
      data.nationalNumber
    );
  }
}
