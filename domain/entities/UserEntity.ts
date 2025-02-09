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
    private _token?: string,
    id?: string,
  ) {
    super(id);
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

  public get token(): string | undefined {
    return this._token;
  }

  public setToken(token: string): void {
    this._token = token;
  }

  public clearToken(): void {
    this._token = undefined;
  }

  public isLoggedIn(): boolean {
    return this._token !== undefined;
  }

  static reconstitute(data: {
    id: string;
    firstname: string;
    lastname: string;
    hashedPassword: string;
    emailAddress: string;
    phoneNumber: string;
    address: {
      street: string;
      postalCode: string;
      countryCode: string;
    };
    isAdministrator?: boolean;
    token?: string;
  }): UserEntity {
    const user = new UserEntity(
      Name.reconstitute(data.firstname),
      Name.reconstitute(data.lastname),
      data.hashedPassword,
      EmailAddress.reconstitute(data.emailAddress),
      PhoneNumber.reconstitute(data.phoneNumber),
      Address.reconstitute(data.address),
      data.isAdministrator || false,
      data.token,
      data.id
    );
    return user;
  }
}
