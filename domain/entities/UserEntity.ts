import { JsonValue } from "@prisma/client/runtime/library";
import { Address } from "../value-objects/Address.ts";
import { EmailAddress } from "../value-objects/EmailAddress.ts";
import { Name } from "../value-objects/Name.ts";
import { PhoneNumber } from "../value-objects/PhoneNumber.ts";
import { Entity } from "./Entity.ts";
import { PhoneNumberData } from "../types/PhoneNumberType.ts";
import { AddressData } from "../types/AddressType.ts";

export class UserEntity extends Entity {
  private constructor(
    public firstname: Name,
    public lastname: Name,
    public hashedPassword: string,
    public emailAddress: EmailAddress,
    public phoneNumber: PhoneNumber | null,
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
    phoneNumber: PhoneNumber | null;
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
    phoneNumber: JsonValue;
    address: JsonValue;
    isAdministrator?: boolean;
    token?: string;
  }): UserEntity {
    const user = new UserEntity(
      Name.reconstitute(data.firstname),
      Name.reconstitute(data.lastname),
      data.hashedPassword,
      EmailAddress.reconstitute(data.emailAddress),
      PhoneNumber.reconstitute(data.phoneNumber as PhoneNumberData),
      Address.reconstitute(data.address as AddressData),
      data.isAdministrator || false,
      data.token,
      data.id
    );
    return user;
  }
}
