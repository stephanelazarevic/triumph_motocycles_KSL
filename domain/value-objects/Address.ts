import { AddressInvalidCountryError } from "../errors/AddressInvalidCountryError.ts";
import { AddressInvalidPostalCodeError } from "../errors/AddressInvalidPostalCodeError.ts";
import { AddressTooShortError } from "../errors/AddressTooShortError.ts";
import { CountryService } from "../../application/services/CountryService.ts";
import { AddressData } from "../types/AddressType.ts";

export class Address {
  private static countryService: CountryService;

  private constructor(
    public readonly street: string,
    public readonly postalCode: string,
    public readonly countryCode: string,
  ) {}

  public static from(address: AddressData): Address | Error {
    if (!Address.isValidStreet(address.street)) {
      return new AddressTooShortError();
    }

    if (!Address.isValidPostalCode(address.postalCode)) {
      return new AddressInvalidPostalCodeError();
    }

    if (!Address.isValidCountryCode(address.countryCode)) {
      return new AddressInvalidCountryError();
    }

    return new Address(address.street, address.postalCode, address.countryCode);
  }

  public getValue(): AddressData {
    return {
      street: this.street,
      postalCode: this.postalCode,
      countryCode: this.countryCode
    };
  }

  private static isValidStreet(street: string): boolean {
    return street.length >= 3;
  }

  private static isValidPostalCode(postalCode: string): boolean {
    const postalCodeRegex = /^\d{5}$/;
    return postalCodeRegex.test(postalCode);
  }

  private static isValidCountryCode(countryCode: string): boolean {
    return Address.countryService.isValidCountry(countryCode);
  }

  public getFormattedAddress(): string {
    return `${this.street}, ${this.postalCode} ${this.getCountryName()}`;
  }

  public getCountryName(): string {
    return Address.countryService.getCountryName(this.countryCode);
  }

  public equals(address: Address): boolean {
    return this.street === address.street &&
      this.postalCode === address.postalCode &&
      this.countryCode === address.countryCode;
  }

  public static reconstitute(data: AddressData): Address {
    return new Address(
      data.street,
      data.postalCode,
      data.countryCode
    );
  }
}
