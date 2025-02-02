import { Address } from "../value-objects/Address.ts";
import { EmailAddress } from "../value-objects/EmailAddress.ts";
import { Name } from "../value-objects/Name.ts";
import { PhoneNumber } from "../value-objects/PhoneNumber.ts";
import { Entity } from "./Entity.ts";

export class UserEntity extends Entity {
  private constructor(
    public firstname: Name,
    public lastname: Name,
    public hashedPassword: string,
    public emailAddress: EmailAddress,
    public phoneNumber: PhoneNumber,
    public address: Address,
    public isAdministrator: boolean = false,
  ) {
    super();
  }

  public static create(params: {
    firstname: Name;
    lastname: Name;
    emailAddress: EmailAddress;
    hashedPassword: string;
    phoneNumber: PhoneNumber;
    address: Address;
  }): UserEntity {
    return new UserEntity(
      params.firstname,
      params.lastname,
      params.hashedPassword,
      params.emailAddress,
      params.phoneNumber,
      params.address,
    );
  }
}
