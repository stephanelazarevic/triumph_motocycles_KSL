import { DriverRepository } from "../../repositories/DriverRepository.ts";
import { updateDriverCommand } from "../../../domain/types/DriverType.ts";
import { DriverEntity } from "../../../domain/entities/DriverEntity.ts";

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
      driver.firstname = command.firstname;
    }
    if (command.lastname) {
      driver.lastname = command.lastname;
    }
    if (command.licenseNumber) {
      driver.licenseNumber = command.licenseNumber;
    }
    if (command.phoneNumber) {
      driver.phoneNumber = command.phoneNumber;
    }
    if (command.emailAddress) {
      driver.emailAddress = command.emailAddress;
    }

    driver.markAsUpdated();
    await this.driverRepository.save(driver);

    return driver;
  }
}
