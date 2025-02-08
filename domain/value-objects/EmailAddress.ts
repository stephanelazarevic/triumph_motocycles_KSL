import { EmailAddressInvalidFormatError } from "../errors/EmailAddressInvalidFormatError.ts";

export class EmailAddress {
  private constructor(private readonly value: string) {}

  public static from(email: string): EmailAddress | Error {
    if (!EmailAddress.isValidEmail(email)) {
      return new EmailAddressInvalidFormatError();
    }

    return new EmailAddress(email);
  }

  private static isValidEmail(email: string): boolean {
    const emailFormatted = email.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(emailFormatted);
  }

  public equals(email: EmailAddress): boolean {
    return this.getValue() === email.getValue();
  }

  public getValue(): string {
    return this.value;
  }

  public static reconstitute (value: string){
    return new EmailAddress(value);
  }
}
