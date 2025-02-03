import { DriverRepository } from "../../repositories/DriverRepository.ts";
import { DriverNotFoundError } from "../../../domain/errors/DriverNotFoundError.ts";

export class DeleteDriverUsecase {
  constructor(private driverRepository: DriverRepository) {}

  public async execute(id: string): Promise<DriverNotFoundError | void> {
    const existingDriver = await this.driverRepository.findOneById(id);
    if (!existingDriver) {
      return new DriverNotFoundError();
    }

    await this.driverRepository.delete(id);
  }
}
