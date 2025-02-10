import { DriverEntity } from "../../../domain/entities/DriverEntity.ts";
import { NameType } from "../../../domain/enum/NameEnum.ts";
import { MotorcycleNotFoundError } from "../../../domain/errors/MotorcycleNotFoundError.ts";
import { AddDriverCommand } from "../../../domain/types/DriverType.ts";
import { EmailAddress } from "../../../domain/value-objects/EmailAddress.ts";
import { Name } from "../../../domain/value-objects/Name.ts";
import { PhoneNumber } from "../../../domain/value-objects/PhoneNumber.ts";
import type { DriverRepository } from "../../repositories/DriverRepository.ts";
import type { MotorcycleRepository } from "../../repositories/MotorcycleRepository.ts";

export class AddDriverUsecase {
  public constructor(
    private readonly driverRepository: DriverRepository,
    private readonly motorcycleRepository: MotorcycleRepository,
  ) {}

  public async execute(command: AddDriverCommand): Promise<DriverEntity | Error> {
    const motorcycle = await this.motorcycleRepository.findOneById(
      command.motorcycleId,
    );

    if (motorcycle instanceof MotorcycleNotFoundError) {
      return motorcycle;
    }

    const validFirstname = Name.from(command.firstname, NameType.FIRSTNAME)
    if(validFirstname instanceof Error){
      return validFirstname;
    }

    const validLastname = Name.from(command.lastname, NameType.LASTNAME)
    if(validLastname instanceof Error){
      return validLastname;
    }

    const validPhoneNumber = PhoneNumber.from(command.phoneNumber)
    if(validPhoneNumber instanceof Error){
      return validPhoneNumber;
    }

    const validEmailAddress = EmailAddress.from(command.emailAddress)
    if(validEmailAddress instanceof Error){
      return validEmailAddress;
    }

    const driver = DriverEntity.create({
      enterpriseId: command.enterpriseId,
      motorcycleId: command.motorcycleId,
      firstname: validFirstname,
      lastname: validLastname,
      licenseNumber: command.licenseNumber,
      phoneNumber: validPhoneNumber,
      emailAddress: validEmailAddress,
    });

    await this.driverRepository.save(driver);
    return driver;
  }
}
