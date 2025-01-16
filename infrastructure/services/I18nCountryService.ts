import isoCountries from "npm:i18n-iso-countries";
import { CountryService } from "domain/services/CountryService.ts";
import { AddressCountryNotFoundError } from "domain/errors/AddressCountryNotFoundError.ts";

export class I18nCountryService implements CountryService {
  public getCountryName(countryCode: string): string {
    const countryName = isoCountries.getName(countryCode, "fr");

    if (!countryName) {
      throw new AddressCountryNotFoundError();
    }

    return countryName;
  }

  public isValidCountry(countryCode: string): boolean {
    return isoCountries.isValid(countryCode);
  }
}
