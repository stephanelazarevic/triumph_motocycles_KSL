import { EmailAddress } from "../../../../domain/value-objects/EmailAddress.ts";
import { EmailAddressInvalidFormatError } from "../../../../domain/errors/EmailAddressInvalidFormatError.ts";

Deno.test("Should create a valid EmailAddress instance", () => {
  const validEmail = EmailAddress.from("John.Doe@Example.com");

  if (validEmail instanceof Error) {
    throw new Error(`Test failed: Unexpected error ${validEmail.message}.`);
  }

  console.assert(
    validEmail.getValue() === "john.doe@example.com",
    "Expected email to be normalized to lowercase.",
  );
});

Deno.test("Should fail for an email with invalid format (missing @)", () => {
  const invalidEmail = "John.DoeExample.com";

  const resultEmailAddress = EmailAddress.from(invalidEmail);

  if (!(resultEmailAddress instanceof EmailAddressInvalidFormatError)) {
    throw new Error("Test failed: Expected EmailAddressInvalidFormatError.");
  }

  console.assert(
    resultEmailAddress instanceof EmailAddress,
    "Expected error message to match.",
  );
});

Deno.test(
  "Should fail for an email with invalid format (missing domain)",
  () => {
    const invalidEmail = "John.Doe@";

    const resultEmailAddress = EmailAddress.from(invalidEmail);

    if (!(resultEmailAddress instanceof EmailAddressInvalidFormatError)) {
      throw new Error("Test failed: Expected EmailAddressInvalidFormatError.");
    }

    console.assert(
      resultEmailAddress.message === "Email address has an invalid format.",
      "Expected error message to match.",
    );
  },
);

Deno.test(
  "Should fail for an email with invalid format (missing username)",
  () => {
    const invalidEmail = "@example.com";

    const resultEmailAddress = EmailAddress.from(invalidEmail);

    if (!(resultEmailAddress instanceof EmailAddressInvalidFormatError)) {
      throw new Error("Test failed: Expected EmailAddressInvalidFormatError.");
    }

    console.assert(
      resultEmailAddress.message === "Email address has an invalid format.",
      "Expected error message to match.",
    );
  },
);

Deno.test("Should fail for an email with invalid format (missing TLD)", () => {
  const invalidEmail = "john.doe@example";

  const resultEmailAddress = EmailAddress.from(invalidEmail);

  if (!(resultEmailAddress instanceof EmailAddressInvalidFormatError)) {
    throw new Error("Test failed: Expected EmailAddressInvalidFormatError.");
  }

  console.assert(
    resultEmailAddress.message === "Email address has an invalid format.",
    "Expected error message to match.",
  );
});

Deno.test("Should normalize a valid email by trimming spaces", () => {
  const validEmailWithSpaces = "   John.Doe@Example.com   ";

  const resultEmailAddress = EmailAddress.from(validEmailWithSpaces);

  if (resultEmailAddress instanceof Error) {
    throw new Error(`Test failed: Unexpected error ${resultEmailAddress.message}.`);
  }

  console.assert(
    resultEmailAddress.getValue() === "john.doe@example.com",
    "Expected email to be trimmed and normalized.",
  );
});
