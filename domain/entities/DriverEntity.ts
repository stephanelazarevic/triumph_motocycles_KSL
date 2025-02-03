import type { EnterpriseEntity } from "./EnterpriseEntity.ts";
import type { MotorcycleEntity } from "./MotorcycleEntity.ts";
import { Entity } from "./Entity.ts";
import { Name } from "../value-objects/Name.ts";
import { PhoneNumber } from "../value-objects/PhoneNumber.ts";
import { EmailAddress } from "../value-objects/EmailAddress.ts";

export class DriverEntity extends Entity {
  private constructor(
    public enterprise: EnterpriseEntity,
    public motorcycle: MotorcycleEntity,
    public firstname: Name,
    public lastname: Name,
    public licenseNumber: number,
    public phoneNumber: PhoneNumber,
    public emailAddress: EmailAddress
  ) {
    super();
  }

  public static create( params: {
    enterprise: EnterpriseEntity;
    motorcycle: MotorcycleEntity;
    firstname: Name;
    lastname: Name;
    licenseNumber: number;
    phone: PhoneNumber;
    email: EmailAddress;
  }) {
    return new DriverEntity(
      params.enterprise,
      params.motorcycle,
      params.firstname,
      params.lastname,
      params.licenseNumber,
      params.phone,
      params.email
    );
  }
}
