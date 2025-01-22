import { Address } from "../../domain/types/Address.ts";
import { EmailAddress } from "../../domain/types/EmailAddress.ts";
import { PhoneNumber } from "../../domain/types/PhoneNumber.ts";

export class UserEntity {
  protected constructor(
    public readonly id: string,
    public readonly firstname: string,
    public readonly lastname: string,
    public readonly hashedPassword: string,
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
    emailAddress: string,
    hashedPassword: string,
    phoneNumber: string,
    street: string,
    postalCode: string,
    countryCode: string,
    isAdministrator: boolean
  ) {
    const id = crypto.randomUUID();
    const createdAt = new Date();
    const updatedAt = new Date();

    const formattedFirstname = this.formatFirstName(firstname);
    const formattedLastname = this.formatLastName(lastname);

    const validPhoneNumber = PhoneNumber.from(phoneNumber);
    if (validPhoneNumber instanceof Error) {
      return validPhoneNumber;
    }

    const validEmailAddress = EmailAddress.from(emailAddress);
    if (validEmailAddress instanceof Error) {
      return validEmailAddress;
    }

    const address = Address.from(street, postalCode, countryCode);
    if (address instanceof Error) {
      return address;
    }

    return new UserEntity(
      id,
      formattedFirstname,
      formattedLastname,
      hashedPassword,
      validEmailAddress,
      validPhoneNumber,
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
