import { Address } from "../../../../domain/value-objects/Address.ts";
import { AddressTooShortError } from "../../../../domain/errors/AddressTooShortError.ts";
import { AddressInvalidPostalCodeError } from "../../../../domain/errors/AddressInvalidPostalCodeError.ts";
import { AddressInvalidCountryError } from "../../../../domain/errors/AddressInvalidCountryError.ts";
import { CountryService } from "../../../../domain/services/CountryService.ts";

class MockCountryService implements CountryService {
  private validCountries = new Map([
    ["US", "United States"],
    ["FR", "France"],
    ["DE", "Germany"],
  ]);

  isValidCountry(code: string): boolean {
    return this.validCountries.has(code);
  }

  getCountryName(code: string): string {
    return this.validCountries.get(code) || "Unknown";
  }
}

Address["countryService"] = new MockCountryService();

Deno.test("Should create a valid Address instance", () => {
  const validStreet = "123 Main St";
  const validPostalCode = "12345";
  const validCountryCode = "US";

  const result = Address.from(validStreet, validPostalCode, validCountryCode);

  if (result instanceof Error) {
    throw new Error(`Test failed: Unexpected error ${result.message}.`);
  }

  console.assert(
    result.street === validStreet,
    "Street should match the input.",
  );
  console.assert(
    result.postalCode === validPostalCode,
    "Postal code should match the input.",
  );
  console.assert(
    result.countryCode === validCountryCode,
    "Country code should match the input.",
  );
});

Deno.test("Should fail when the street is too short", () => {
  const shortStreet = "St";
  const validPostalCode = "12345";
  const validCountryCode = "US";

  const result = Address.from(shortStreet, validPostalCode, validCountryCode);

  if (!(result instanceof AddressTooShortError)) {
    throw new Error("Test failed: Expected AddressTooShortError.");
  }
});

Deno.test("Should fail when the postal code is invalid (non-numeric)", () => {
  const validStreet = "123 Main St";
  const invalidPostalCode = "ABCDE";
  const validCountryCode = "US";

  const result = Address.from(validStreet, invalidPostalCode, validCountryCode);

  if (!(result instanceof AddressInvalidPostalCodeError)) {
    throw new Error("Test failed: Expected AddressInvalidPostalCodeError.");
  }
});

Deno.test("Should fail when the postal code is invalid (wrong length)", () => {
  const validStreet = "123 Main St";
  const invalidPostalCode = "1234";
  const validCountryCode = "US";

  const result = Address.from(validStreet, invalidPostalCode, validCountryCode);

  if (!(result instanceof AddressInvalidPostalCodeError)) {
    throw new Error("Test failed: Expected AddressInvalidPostalCodeError.");
  }
});

Deno.test("Should fail when the country code is invalid", () => {
  const validStreet = "123 Main St";
  const validPostalCode = "12345";
  const invalidCountryCode = "ZZ";

  const result = Address.from(validStreet, validPostalCode, invalidCountryCode);

  if (!(result instanceof AddressInvalidCountryError)) {
    throw new Error("Test failed: Expected AddressInvalidCountryError.");
  }
});

Deno.test("Should return full address with country name", () => {
  const validStreet = "123 Main St";
  const validPostalCode = "12345";
  const validCountryCode = "US";

  const result = Address.from(validStreet, validPostalCode, validCountryCode);

  if (result instanceof Error) {
    throw new Error(`Test failed: Unexpected error ${result.message}.`);
  }

  console.assert(
    result instanceof Address,
    `Expected full address to be '123 Main St, 12345 United States' but got an error`,
  );
});
