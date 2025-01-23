import { EmailAddress } from "../../../../domain/types/EmailAddress.ts";
import { EmailAddressInvalidFormatError } from "../../../../domain/errors/EmailAddressInvalidFormatError.ts";

Deno.test("Should create a valid EmailAddress instance", () => {
  const validEmail = "John.Doe@Example.com";

  const result = EmailAddress.from(validEmail);

  if (result instanceof Error) {
    throw new Error(`Test failed: Unexpected error ${result.message}.`);
  }

  console.assert(
    result.email === "john.doe@example.com",
    "Expected email to be normalized to lowercase."
  );
});

Deno.test("Should fail for an email with invalid format (missing @)", () => {
  const invalidEmail = "John.DoeExample.com";

  const result = EmailAddress.from(invalidEmail);

  if (!(result instanceof EmailAddressInvalidFormatError)) {
    throw new Error("Test failed: Expected EmailAddressInvalidFormatError.");
  }

  console.assert(
    result.message === "Email address has an invalid format.",
    "Expected error message to match."
  );
});

Deno.test(
  "Should fail for an email with invalid format (missing domain)",
  () => {
    const invalidEmail = "John.Doe@";

    const result = EmailAddress.from(invalidEmail);

    if (!(result instanceof EmailAddressInvalidFormatError)) {
      throw new Error("Test failed: Expected EmailAddressInvalidFormatError.");
    }

    console.assert(
      result.message === "Email address has an invalid format.",
      "Expected error message to match."
    );
  }
);

Deno.test(
  "Should fail for an email with invalid format (missing username)",
  () => {
    const invalidEmail = "@example.com";

    const result = EmailAddress.from(invalidEmail);

    if (!(result instanceof EmailAddressInvalidFormatError)) {
      throw new Error("Test failed: Expected EmailAddressInvalidFormatError.");
    }

    console.assert(
      result.message === "Email address has an invalid format.",
      "Expected error message to match."
    );
  }
);

Deno.test("Should fail for an email with invalid format (missing TLD)", () => {
  const invalidEmail = "john.doe@example";

  const result = EmailAddress.from(invalidEmail);

  if (!(result instanceof EmailAddressInvalidFormatError)) {
    throw new Error("Test failed: Expected EmailAddressInvalidFormatError.");
  }

  console.assert(
    result.message === "Email address has an invalid format.",
    "Expected error message to match."
  );
});

Deno.test("Should normalize a valid email by trimming spaces", () => {
  const validEmailWithSpaces = "   John.Doe@Example.com   ";

  const result = EmailAddress.from(validEmailWithSpaces);

  if (result instanceof Error) {
    throw new Error(`Test failed: Unexpected error ${result.message}.`);
  }

  console.assert(
    result.email === "john.doe@example.com",
    "Expected email to be trimmed and normalized."
  );
});
