import { EmailAddress } from "../value-objects/EmailAddress.ts";
import { Name } from "../value-objects/Name.ts";
import { PhoneNumber } from "../value-objects/PhoneNumber.ts";

export interface AddDriverCommand {
  enterpriseId: string,
  motorcycleId: string,
  firstname: Name,
  lastname: Name,
  licenseNumber: number,
  phoneNumber: PhoneNumber,
  emailAddress: EmailAddress
}

export interface updateDriverCommand extends Partial<AddDriverCommand> {
}
