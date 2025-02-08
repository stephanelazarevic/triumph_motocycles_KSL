import { DriverRepository } from "../../repositories/DriverRepository.ts";
import { EnterpriseRepository } from "../../repositories/EnterpriseRepository.ts";
import { updateDriverCommand } from "../../../domain/types/DriverType.ts";
import { MotorcycleRepository } from "../../repositories/MotorcycleRepository.ts";
import { DriverEntity } from "../../../domain/entities/DriverEntity.ts";

export class UpdateDriverUsecase {
  constructor(
    private driverRepository: DriverRepository,
    private enterpriseRepository: EnterpriseRepository,
    private motorcycleRepository: MotorcycleRepository
  ) {}

  public async execute(driverId: string, command: updateDriverCommand): Promise<DriverEntity | Error> {
    const driver = await this.driverRepository.findOneById(driverId);
    if (driver instanceof Error) {
      return driver;
    }

    if (command.enterpriseId) {
        const enterprise = await this.enterpriseRepository.findOneById(command.enterpriseId);
        if (enterprise instanceof Error) {
          return enterprise;
        }
        driver.enterprise = enterprise;
      }

    if (command.motorcycleId) {
      const motorcycle = await this.motorcycleRepository.findOneById(command.motorcycleId);
      if (motorcycle instanceof Error) {
        return motorcycle;
      }
      driver.motorcycle = motorcycle;
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
