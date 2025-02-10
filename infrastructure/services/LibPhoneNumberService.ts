import { isValidPhoneNumber, parsePhoneNumberWithError } from "npm:libphonenumber-js";
import { PhoneNumberService } from "../../application/services/PhoneNumberService.ts";
import { PhoneNumberFormatError } from "../../domain/errors/PhoneNumberFormatError.ts";

export class LibPhoneNumberService implements PhoneNumberService {
  public formatInternational(phoneNumber: string): string {
    try {
      const parsedPhoneNumber = parsePhoneNumberWithError(phoneNumber);
      return parsedPhoneNumber.format('INTERNATIONAL');
    } catch {
      throw new PhoneNumberFormatError();
    }
  }

  public formatNational(phoneNumber: string): string {
    try {
      const parsedPhoneNumber = parsePhoneNumberWithError(phoneNumber);
      return parsedPhoneNumber.formatNational();
    } catch {
      throw new PhoneNumberFormatError();
    }
  }

  public isValid(phoneNumber: string): boolean {
    return isValidPhoneNumber(phoneNumber);
  }

  public extractCountryCode(phoneNumber: string): string {
    const parsed = parsePhoneNumberWithError(phoneNumber);
    return parsed.countryCallingCode;
  }

  public extractNumber(phoneNumber: string): string {
    const parsed = parsePhoneNumberWithError(phoneNumber);
    return parsed.nationalNumber;
  }
}
