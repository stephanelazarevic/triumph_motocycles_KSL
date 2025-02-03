import { DriverEntity } from "../../../domain/entities/DriverEntity.ts";
import { EnterpriseNotFoundError } from "../../../domain/errors/EnterpriseNotFoundError.ts";
import { MotorcycleNotFoundError } from "../../../domain/errors/MotorcycleNotFoundError.ts";
import { AddDriverCommand } from "../../../domain/types/DriverType.ts";
import type { DriverRepository } from "../../repositories/DriverRepository.ts";
import type { EnterpriseRepository } from "../../repositories/EnterpriseRepository.ts";
import type { MotorcycleRepository } from "../../repositories/MotorcycleRepository.ts";

export class AddDriverUsecase {
  public constructor(
    private readonly driverRepository: DriverRepository,
    private readonly enterpriseRepository: EnterpriseRepository,
    private readonly motorcycleRepository: MotorcycleRepository,
  ) {}

  public async execute(command: AddDriverCommand): Promise<DriverEntity | Error> {
    const enterprise = await this.enterpriseRepository.findOneById(
        command.enterpriseId,
    );

    if (enterprise instanceof EnterpriseNotFoundError) {
        return enterprise;
      }

    const motorcycle = await this.motorcycleRepository.findOneById(
      command.motorcycleId,
    );

    if (motorcycle instanceof MotorcycleNotFoundError) {
      throw motorcycle;
    }

    const driver = DriverEntity.create({
      enterprise,
      motorcycle,
      firstname: command.firstname,
      lastname: command.lastname,
      licenseNumber: command.licenseNumber,
      phone: command.phone,
      email: command.email
    });

    await this.driverRepository.save(driver);
    return driver;
  }
}
