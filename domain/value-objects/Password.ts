import { PasswordMissingLowercaseError } from "../errors/PasswordMissingLowercaseError.ts";
import { PasswordMissingNumberError } from "../errors/PasswordMissingNumberError.ts";
import { PasswordMissingSymbolError } from "../errors/PasswordMissingSymbolError.ts";
import { PasswordMissingUppercaseError } from "../errors/PasswordMissingUppercaseError.ts";
import { PasswordTooShortError } from "../errors/PasswordTooShortError.ts";

export class Password {
  private constructor(private readonly value: string) {}

  public static from(value: string): Password | Error {
    if (!Password.isValidPasswordLength(value)) {
      return new PasswordTooShortError();
    }

    if (!Password.containsLowercase(value)) {
      return new PasswordMissingLowercaseError();
    }

    if (!Password.containsUppercase(value)) {
      return new PasswordMissingUppercaseError();
    }

    if (!Password.containsNumber(value)) {
      return new PasswordMissingNumberError();
    }

    if (!Password.containsSymbol(value)) {
      return new PasswordMissingSymbolError();
    }

    return new Password(value);
  }

  private static isValidPasswordLength(value: string): boolean {
    return value.length >= 8;
  }

  private static containsLowercase(value: string): boolean {
    const containsLowercaseRegex = new RegExp("[a-z]");
    return containsLowercaseRegex.test(value);
  }

  private static containsUppercase(value: string): boolean {
    const containsUppercaseRegex = new RegExp("[A-Z]");
    return containsUppercaseRegex.test(value);
  }

  private static containsNumber(value: string): boolean {
    const containsNumberRegex = new RegExp("\\d");
    return containsNumberRegex.test(value);
  }

  private static containsSymbol(value: string): boolean {
    const containsSymbolRegex = new RegExp("[^a-zA-Z0-9]");
    return containsSymbolRegex.test(value);
  }

  public equals(password: Password): boolean {
    return this.value === password.value;
  }
}
