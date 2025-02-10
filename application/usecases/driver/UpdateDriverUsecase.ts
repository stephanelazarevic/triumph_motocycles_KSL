import { DriverRepository } from "../../repositories/DriverRepository.ts";
import { updateDriverCommand } from "../../../domain/types/DriverType.ts";
import { DriverEntity } from "../../../domain/entities/DriverEntity.ts";
import { Name } from "../../../domain/value-objects/Name.ts";
import { NameType } from "../../../domain/enum/NameEnum.ts";
import { PhoneNumber } from "../../../domain/value-objects/PhoneNumber.ts";
import { EmailAddress } from "../../../domain/value-objects/EmailAddress.ts";

export class UpdateDriverUsecase {
  constructor(
    private driverRepository: DriverRepository,
  ) {}

  public async execute(driverId: string, command: updateDriverCommand): Promise<DriverEntity | Error> {
    const driver = await this.driverRepository.findOneById(driverId);
    if (driver instanceof Error) {
      return driver;
    }

    if (command.enterpriseId) {
        driver.enterpriseId = command.enterpriseId;
      }

    if (command.motorcycleId) {
      driver.motorcycleId = command.motorcycleId;
    }

    if (command.firstname) {
      const validFirstname = Name.from(command.firstname, NameType.FIRSTNAME)
        if(validFirstname instanceof Error){
          return validFirstname;
        }
    }
    if (command.lastname) {
      const validLastname = Name.from(command.lastname, NameType.LASTNAME)
        if(validLastname instanceof Error){
          return validLastname;
        }
    }
    if (command.licenseNumber) {
      driver.licenseNumber = command.licenseNumber;
    }
    if (command.phoneNumber) {
      const validPhoneNumber = PhoneNumber.from(command.phoneNumber)
        if(validPhoneNumber instanceof Error){
          return validPhoneNumber;
        }
    }
    if (command.emailAddress) {
      const validEmailAddress = EmailAddress.from(command.emailAddress)
        if(validEmailAddress instanceof Error){
          return validEmailAddress;
        }
    }

    driver.markAsUpdated();
    await this.driverRepository.save(driver);

    return driver;
  }
}
