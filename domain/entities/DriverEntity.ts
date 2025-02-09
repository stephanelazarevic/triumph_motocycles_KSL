import { Entity } from "./Entity.ts";
import { Name } from "../value-objects/Name.ts";
import { PhoneNumber } from "../value-objects/PhoneNumber.ts";
import { EmailAddress } from "../value-objects/EmailAddress.ts";
import { JsonValue } from "@prisma/client/runtime/library";
import { PhoneNumberData } from "../types/PhoneNumberType.ts";

export class DriverEntity extends Entity {
  private constructor(
    public enterpriseId: string,
    public motorcycleId: string,
    public firstname: Name,
    public lastname: Name,
    public licenseNumber: string,
    public phoneNumber: PhoneNumber,
    public emailAddress: EmailAddress,
    id?: string
  ) {
    super(id);
  }

  public static create( params: {
    enterpriseId: string;
    motorcycleId: string;
    firstname: Name;
    lastname: Name;
    licenseNumber: string;
    phoneNumber: PhoneNumber;
    emailAddress: EmailAddress;
  }) {
    return new DriverEntity(
      params.enterpriseId,
      params.motorcycleId,
      params.firstname,
      params.lastname,
      params.licenseNumber,
      params.phoneNumber,
      params.emailAddress
    );
  }

  public static reconstitute(data: {
    id: string;
    enterpriseId: string;
    motorcycleId: string;
    firstname: string;
    lastname: string;
    licenseNumber: string;
    phoneNumber: JsonValue
    emailAddress: string;
  }): DriverEntity {
    return new DriverEntity(
      data.enterpriseId,
      data.motorcycleId,
      Name.reconstitute(data.firstname),
      Name.reconstitute(data.lastname),
      data.licenseNumber,
      PhoneNumber.reconstitute(data.phoneNumber as PhoneNumberData),
      EmailAddress.reconstitute(data.emailAddress),
      data.id,
    );
  }
}
