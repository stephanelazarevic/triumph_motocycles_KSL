import {
  parsePhoneNumberWithError,
  isValidPhoneNumber,
} from "npm:libphonenumber-js";
import { PhoneNumberService } from "domain/services/PhoneNumberService.ts";
import { PhoneNumberFormatError } from "domain/errors/PhoneNumberFormatError.ts";

export class LibPhoneNumberService implements PhoneNumberService {
  public formatPhoneNumber(phoneNumber: string): string {
    try {
      const parsedPhone = parsePhoneNumberWithError(phoneNumber);
      if (parsedPhone) {
        return parsedPhone.format("E.164");
      }
      throw new PhoneNumberFormatError();
    } catch {
      throw new Error("Unable to format phone number");
    }
  }

  public isValidPhoneNumber(phoneNumber: string): boolean {
    try {
      return isValidPhoneNumber(phoneNumber);
    } catch {
      return false;
    }
  }
}
