export interface PhoneNumberService {
  /**
   * Formats the provided phone number to the national standard.
   * @param phoneNumber - The phone number to be formatted.
   * @returns The phone number formatted to the national standard.
   */
  formatNational(phoneNumber: string): string;

  /**
   * Formats the provided phone number to the international E.164 standard.
   * @param phoneNumber - The phone number to be formatted.
   * @returns The phone number formatted to the international standard.
   */
  formatInternational(phoneNumber: string): string;

  /**
   * Validates whether the provided phone number is in a valid format according to international standards.
   * @param phoneNumber - The phone number to be validated.
   * @returns A boolean indicating whether the phone number is valid.
   */
  isValid(phoneNumber: string): boolean;

  /**
   * Extracts the country code out of a phoneNumber.
   * @param phoneNumber - The phone number to extract the country code from.
   * @returns A string of the outputed country code.
   */
  extractCountryCode(phoneNumber: string): string;

  /**
   * Extracts the national number out of a phoneNumber.
   * @param phoneNumber - The phone number to extract the national number from.
   * @returns A string of the outputed national number.
   */
  extractNumber(phoneNumber: string): string;
}
