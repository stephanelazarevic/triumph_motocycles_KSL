import { DriverEntity } from "../../../domain/entities/DriverEntity.ts";
import { DriverNotFoundError } from "../../../domain/errors/DriverNotFoundError.ts";
import { DriverRepository } from "../../repositories/DriverRepository.ts";

export class GetDriverUsecase {
  constructor(private driverRepository: DriverRepository) {}

  public async execute(id: string): Promise<DriverEntity | DriverNotFoundError> {
    const existing = await this.driverRepository.findOneById(id);
    if (!existing) {
      return new DriverNotFoundError();
    }
    return existing;
  }
}
