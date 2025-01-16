export interface CountryService {
  /**
   * Returns the corresponding country name.
   * @param countryCode - The country code
   * @returns The country name matching that country code
   */
  getCountryName(countryCode: string): string;

  /**
   * Validates if the given country is a valid country
   * @param countryCode - The country code to validate
   * @returns true if an existing country false if unknown
   */
  isValidCountry(countryCode: string): boolean;
}
