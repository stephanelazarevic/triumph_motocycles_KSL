import {
  parsePhoneNumberWithError,
  isValidPhoneNumber,
} from "npm:libphonenumber-js";
import { PhoneNumberService } from "domain/services/PhoneNumberService.ts";
import { PhoneNumberFormatError } from "domain/errors/PhoneNumberFormatError.ts";

export class LibPhoneNumberService implements PhoneNumberService {
  public formatInternational(phoneNumber: string): string {
    try {
      const parsedPhoneNumber = parsePhoneNumberWithError(phoneNumber);
      return parsedPhoneNumber.formatInternational();
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
}
