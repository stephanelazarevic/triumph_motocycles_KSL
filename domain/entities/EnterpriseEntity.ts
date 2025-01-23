import { Address } from "../types/Address.ts";
import { EmailAddress } from "../types/EmailAddress.ts";
import { PhoneNumber } from "../types/PhoneNumber.ts";
import { UserEntity } from "./UserEntity.ts";


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
