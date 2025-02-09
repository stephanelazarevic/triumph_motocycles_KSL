import { Entity } from "./Entity.ts";
import { Name } from "../value-objects/Name.ts";
import { PhoneNumber } from "../value-objects/PhoneNumber.ts";
import { EmailAddress } from "../value-objects/EmailAddress.ts";
import { JsonValue } from "@prisma/client/runtime/library";
import { PhoneNumberData } from "../types/PhoneNumberType.ts";

export class DriverEntity extends Entity {
  private constructor(
    public idEnterprise: string,
    public idMotorcycle: string,
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
    idEnterprise: string;
    idMotorcycle: string;
    firstname: Name;
    lastname: Name;
    licenseNumber: string;
    phone: PhoneNumber;
    email: EmailAddress;
  }) {
    return new DriverEntity(
      params.idEnterprise,
      params.idMotorcycle,
      params.firstname,
      params.lastname,
      params.licenseNumber,
      params.phone,
      params.email
    );
  }

  public static reconstitute(data: {
    id: string;
    idEnterprise: string;
    idMotorcycle: string;
    firstname: string;
    lastname: string;
    licenseNumber: string;
    phoneNumber: JsonValue
    emailAddress: string;
  }): DriverEntity {
    return new DriverEntity(
      data.idEnterprise,
      data.idMotorcycle,
      Name.reconstitute(data.firstname),
      Name.reconstitute(data.lastname),
      data.licenseNumber,
      PhoneNumber.reconstitute(data.phoneNumber as PhoneNumberData),
      EmailAddress.reconstitute(data.emailAddress),
      data.id,
    );
  }
}
