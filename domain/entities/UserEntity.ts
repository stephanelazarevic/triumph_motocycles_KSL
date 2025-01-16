import { Password } from "domain/types/Password.ts";
import { Address } from "domain/types/Address.ts";
import { EmailAddress } from "domain/types/EmailAddress.ts";
import { PhoneNumber } from "domain/types/PhoneNumber.ts";

export class UserEntity {
  private constructor(
    public readonly identifier: string,
    public readonly firstname: string,
    public readonly lastname: string,
    public readonly password: Password,
    public readonly emailAddress: EmailAddress,
    public readonly phoneNumber: PhoneNumber,
    public readonly address: Address,
    public readonly isAdministrator: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  public static create(
    firstname: string,
    lastname: string,
    emailAddressValue: string,
    passwordValue: string,
    phoneNumberValue: string,
    street: string,
    postalCode: string,
    countryCode: string,
    isAdministrator: boolean
  ) {
    const identifier = crypto.randomUUID();
    const createdAt = new Date();
    const updatedAt = new Date();

    const formattedFirstname = this.formatFirstName(firstname);
    const formattedLastname = this.formatLastName(lastname);

    const password = Password.from(passwordValue);
    if (password instanceof Error) {
      return password;
    }

    const phoneNumber = PhoneNumber.from(phoneNumberValue);
    if (phoneNumber instanceof Error) {
      return phoneNumber;
    }

    const emailAddress = EmailAddress.from(emailAddressValue);
    if (emailAddress instanceof Error) {
      return emailAddress;
    }

    const address = Address.from(street, postalCode, countryCode);
    if (address instanceof Error) {
      return address;
    }

    return new UserEntity(
      identifier,
      formattedFirstname,
      formattedLastname,
      password,
      emailAddress,
      phoneNumber,
      address,
      isAdministrator,
      updatedAt,
      createdAt
    );
  }

  public getName(): string {
    return `${this.firstname} ${this.lastname}`;
  }

  private static formatFirstName(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }

  private static formatLastName(name: string): string {
    return name.toUpperCase();
  }
}
