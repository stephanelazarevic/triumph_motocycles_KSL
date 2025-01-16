import { PasswordMissingLowercaseError } from "domain/errors/PasswordMissingLowercaseError.ts";
import { PasswordMissingUppercaseError } from "domain/errors/PasswordMissingUppercaseError.ts";
import { PasswordMissingNumberError } from "domain/errors/PasswordMissingNumberError.ts";
import { PasswordMissingSymbolError } from "domain/errors/PasswordMissingSymbolError.ts";
import { PasswordTooShortError } from "domain/errors/PasswordTooShortError.ts";

export class Password {
  private constructor(public readonly value: string) {}

  public static from(value: string) {
    if (value.length < 8) {
      return new PasswordTooShortError();
    }

    const constainsLowercaseRegex = new RegExp("[a-z]");
    if (!constainsLowercaseRegex.test(value)) {
      return new PasswordMissingLowercaseError();
    }

    const constainsUppercaseRegex = new RegExp("[A-Z]");
    if (!constainsUppercaseRegex.test(value)) {
      return new PasswordMissingUppercaseError();
    }

    const constainsNumbersRegex = new RegExp("\\d");
    if (!constainsNumbersRegex.test(value)) {
      return new PasswordMissingNumberError();
    }

    const constainsSymbolRegex = new RegExp("[^a-zA-Z0-9]");
    if (!constainsSymbolRegex.test(value)) {
      return new PasswordMissingSymbolError();
    }

    return new Password(value);
  }
}
