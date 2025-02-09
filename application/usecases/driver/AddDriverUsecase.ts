import { DriverEntity } from "../../../domain/entities/DriverEntity.ts";
import { MotorcycleNotFoundError } from "../../../domain/errors/MotorcycleNotFoundError.ts";
import { AddDriverCommand } from "../../../domain/types/DriverType.ts";
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

    const driver = DriverEntity.create({
      enterpriseId: command.enterpriseId,
      motorcycleId: command.motorcycleId,
      firstname: command.firstname,
      lastname: command.lastname,
      licenseNumber: command.licenseNumber,
      phone: command.phoneNumber,
      email: command.emailAddress,
    });

    await this.driverRepository.save(driver);
    return driver;
  }
}
