import { AddressTooShortError } from "../../domain/errors/AddressTooShortError.ts";
import { AddressInvalidPostalCodeError } from "../../domain/errors/AddressInvalidPostalCodeError.ts";
import { AddressInvalidCountryError } from "../../domain/errors/AddressInvalidCountryError.ts";
import { CountryService } from "../../domain/services/CountryService.ts";

export class Address {
  private static countryService: CountryService;

  private constructor(
    public readonly street: string,
    public readonly postalCode: string,
    public readonly countryCode: string
  ) {}

  public static from(
    street: string,
    postalCode: string,
    countryCode: string
  ): Address | Error {
    if (street.length < 3) {
      return new AddressTooShortError();
    }

    const postalCodeRegex = /^\d{5}$/;
    if (!postalCodeRegex.test(postalCode)) {
      return new AddressInvalidPostalCodeError();
    }

    if (!Address.countryService.isValidCountry(countryCode)) {
      return new AddressInvalidCountryError();
    }

    return new Address(street, postalCode, countryCode);
  }

  public getFullAddress(): string {
    return `${this.street}, ${this.postalCode} ${this.getCountryName()}`;
  }

  public getCountryName(): string {
    return Address.countryService.getCountryName(this.countryCode);
  }
}
