import { Address } from "../value-objects/Address.ts";
import { EmailAddress } from "../value-objects/EmailAddress.ts";
import { Name } from "../value-objects/Name.ts";
import { PhoneNumber } from "../value-objects/PhoneNumber.ts";
import { Entity } from "./Entity.ts";

export class User extends Entity{
  private constructor(
    id: string,
    public firstname: Name,
    public lastname: Name,
    public hashedPassword: string,
    public emailAddress: EmailAddress,
    public phoneNumber: PhoneNumber,
    public address: Address,
    public isAdministrator: boolean = false,
    public isActive: boolean = true
  ) {
    super(id);
  }

  public static create(params: {
    firstname: Name,
    lastname: Name,
    emailAddress: EmailAddress,
    hashedPassword: string,
    phoneNumber: PhoneNumber,
    address: Address,
  }): User {
    return new User(
      crypto.randomUUID(),
      params.firstname,
      params.lastname,
      params.hashedPassword,
      params.emailAddress,
      params.phoneNumber,
      params.address
    );
  }

  public deactivate(): void {
    this.isActive = false;
    this.markAsUpdated();
  }

  public getFullName(): string {
    return `${this.firstname.getValue()} ${this.lastname.getValue()}`;
  }
}
