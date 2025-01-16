export interface CountryService {
  /**
   * Returns the corresponding country name.
   * @param countryCode - The country code
   * @returns The country name matching that country code
   */
  getCountryName(countryCode: string): string;

  /**
   * Validates if the given country is a valid country
   * @param country - The country name or code to validate
   * @returns true if an existing country false if unknown
   */
  isValidCountry(country: string): boolean;
}
