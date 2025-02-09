import { Password } from "../../domain/value-objects/Password.ts";

export interface PasswordService {
  /**
   * Hashes a plain password using a secure hashing algorithm.
   * @param password The plain text password to be hashed.
   * @returns A promise that resolves to the hashed password.
   */
  hashPassword(password: Password): Promise<string>;

  /**
   * Compares a plain password with a hashed password to check if they match.
   * @param plainPassword The plain text password to be compared.
   * @param hashedPassword The hashed password to compare the plain password against.
   * @returns A promise that resolves to a boolean indicating if the passwords match.
   */
  comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
