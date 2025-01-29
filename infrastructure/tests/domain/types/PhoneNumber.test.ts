import { PhoneNumberInvalidError } from "../../../../domain/errors/PhoneNumberInvalidError.ts";
import { PhoneNumber } from "../../../../domain/value-objects/PhoneNumber.ts";

Deno.test("Should create a valid PhoneNumber instance", () => {
  const result = PhoneNumber.from("+123456789");

  if (result instanceof Error) {
    throw new Error("Test failed: Expected a valid PhoneNumber instance.");
  }

  console.assert(
    result instanceof PhoneNumber,
    "Expected phone number value to match.",
  );
});

Deno.test("Should fail for invalid phone number format", () => {
  const phoneNumberValue = "12345";

  const result = PhoneNumber.from(phoneNumberValue);

  if (!(result instanceof PhoneNumberInvalidError)) {
    throw new Error("Test failed: Expected PhoneNumberInvalidError.");
  }

  console.assert(
    result.message === "Invalid phone number.",
    "Expected invalid phone number error message.",
  );
});
