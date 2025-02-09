import { EmailAddress } from "../value-objects/EmailAddress.ts";
import { Name } from "../value-objects/Name.ts";
import { PhoneNumber } from "../value-objects/PhoneNumber.ts";

export interface AddDriverCommand {
  enterpriseId: string,
  motorcycleId: string,
  firstname: string,
  lastname: string,
  licenseNumber: string,
  phoneNumber: string,
  emailAddress: string
}

export interface updateDriverCommand extends Partial<AddDriverCommand> {
}
