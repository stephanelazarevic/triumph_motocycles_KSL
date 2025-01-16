import { UserEntity } from "domain/entities/UserEntity.ts";
import { Address } from "domain/types/Address.ts";
import { EmailAddress } from "domain/types/EmailAddress.ts";
import { PhoneNumber } from "domain/types/PhoneNumber.ts";

export class EnterpriseEntity extends UserEntity {
  constructor(
    id: string,
    firstname: string,
    lastname: string,
    hashedPassword: string,
    emailAddress: EmailAddress,
    phoneNumber: PhoneNumber,
    address: Address,
    isAdministrator: boolean,
    createdAt: Date,
    updatedAt: Date,
    public readonly taxNumber: string,
    public readonly industryType: string[]
  ) {
    super(
      id,
      firstname,
      lastname,
      hashedPassword,
      emailAddress,
      phoneNumber,
      address,
      isAdministrator,
      createdAt,
      updatedAt
    );
  }
}
