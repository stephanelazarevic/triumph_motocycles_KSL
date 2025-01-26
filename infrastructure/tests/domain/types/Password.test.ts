import { Password } from "../../../../domain/types/Password.ts";
import { PasswordTooShortError } from "../../../../domain/errors/PasswordTooShortError.ts";
import { PasswordMissingLowercaseError } from "../../../../domain/errors/PasswordMissingLowercaseError.ts";
import { PasswordMissingUppercaseError } from "../../../../domain/errors/PasswordMissingUppercaseError.ts";
import { PasswordMissingNumberError } from "../../../../domain/errors/PasswordMissingNumberError.ts";
import { PasswordMissingSymbolError } from "../../../../domain/errors/PasswordMissingSymbolError.ts";

Deno.test("Should create a valid Password instance", () => {
  const validPassword = "SecurePass123!";

  const result = Password.from(validPassword);

  if (result instanceof Error) {
    throw new Error(`Test failed: Unexpected error ${result.message}.`);
  }

  console.assert(
    result.value === validPassword,
    "Expected password value to match."
  );
});

Deno.test("Should fail for a password that is too short", () => {
  const shortPassword = "Ab1!";

  const result = Password.from(shortPassword);

  if (!(result instanceof PasswordTooShortError)) {
    throw new Error("Test failed: Expected PasswordTooShortError.");
  }

  console.assert(
    result.message === "Password is too short.",
    "Expected error message to match."
  );
});

Deno.test("Should fail for a password missing a lowercase letter", () => {
  const noLowercasePassword = "SECURE123!";

  const result = Password.from(noLowercasePassword);

  if (!(result instanceof PasswordMissingLowercaseError)) {
    throw new Error("Test failed: Expected PasswordMissingLowercaseError.");
  }

  console.assert(
    result.message === "Password must contain at least one lowercase letter.",
    "Expected error message to match."
  );
});

Deno.test("Should fail for a password missing an uppercase letter", () => {
  const noUppercasePassword = "secure123!";

  const result = Password.from(noUppercasePassword);

  if (!(result instanceof PasswordMissingUppercaseError)) {
    throw new Error("Test failed: Expected PasswordMissingUppercaseError.");
  }

  console.assert(
    result.message === "Password must contain at least one uppercase letter.",
    "Expected error message to match."
  );
});

Deno.test("Should fail for a password missing a number", () => {
  const noNumberPassword = "SecurePass!";

  const result = Password.from(noNumberPassword);

  if (!(result instanceof PasswordMissingNumberError)) {
    throw new Error("Test failed: Expected PasswordMissingNumberError.");
  }

  console.assert(
    result.message === "Password must contain at least one number.",
    "Expected error message to match."
  );
});

Deno.test("Should fail for a password missing a symbol", () => {
  const noSymbolPassword = "SecurePass123";

  const result = Password.from(noSymbolPassword);

  if (!(result instanceof PasswordMissingSymbolError)) {
    throw new Error("Test failed: Expected PasswordMissingSymbolError.");
  }

  console.assert(
    result.message === "Password must contain at least one symbol.",
    "Expected error message to match."
  );
});
