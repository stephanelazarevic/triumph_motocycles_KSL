import { EmailAddressInvalidFormatError } from "../errors/EmailAddressInvalidFormatError.ts";

export class EmailAddress {
  private constructor(public readonly value: string) {}

  public static from(email: string): EmailAddress | Error {
    const emailFormatted = email.trim().toLowerCase();

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(emailFormatted)) {
      return new EmailAddressInvalidFormatError();
    }

    return new EmailAddress(emailFormatted);
  }
}
