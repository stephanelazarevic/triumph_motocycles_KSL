import { Entity } from "./Entity.ts";
import { Name } from "../value-objects/Name.ts";
import { PhoneNumber } from "../value-objects/PhoneNumber.ts";
import { EmailAddress } from "../value-objects/EmailAddress.ts";

export class DriverEntity extends Entity {
  private constructor(
    public enterpriseId: string,
    public motorcycleId: string,
    public firstname: Name,
    public lastname: Name,
    public licenseNumber: string,
    public phoneNumber: PhoneNumber,
    public emailAddress: EmailAddress
  ) {
    super();
  }

  public static create( params: {
    enterpriseId: string;
    motorcycleId: string;
    firstname: Name;
    lastname: Name;
    licenseNumber: string;
    phone: PhoneNumber;
    email: EmailAddress;
  }) {
    return new DriverEntity(
      params.enterpriseId,
      params.motorcycleId,
      params.firstname,
      params.lastname,
      params.licenseNumber,
      params.phone,
      params.email
    );
  }

  public static reconstitute(data: {
    id: string;
    enterpriseId: string;
    motorcycleId: string;
    firstname: string;
    lastname: string;
    licenseNumber: string;
    phoneNumber: string;
    emailAddress: string;
  }): DriverEntity {
    return new DriverEntity(
      data.enterpriseId,
      data.motorcycleId,
      Name.reconstitute(data.firstname),
      Name.reconstitute(data.lastname),
      data.licenseNumber,
      PhoneNumber.reconstitute(data.phoneNumber),
      EmailAddress.reconstitute(data.emailAddress)
    );
  }
}
