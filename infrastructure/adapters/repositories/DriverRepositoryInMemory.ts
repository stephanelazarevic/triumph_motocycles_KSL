import { DriverRepository } from "../../../application/repositories/DriverRepository.ts";
import { DriverEntity } from "../../../domain/entities/DriverEntity.ts";
import { DriverNotFoundError } from "../../../domain/errors/DriverNotFoundError.ts";

export class DriverRepositoryInMemory implements DriverRepository {
  public constructor(private drivers: DriverEntity[]) {}

  public save(driver: DriverEntity): Promise<void> {
    const index = this.drivers.findIndex((driver) => driver.id === driver.id);
    if (index === -1) {
      this.drivers.push(driver);
    } else {
      this.drivers[index] = driver;
    }
    return Promise.resolve();
  }

  public findAll(): Promise<DriverEntity[]> {
    return Promise.resolve(this.drivers);
  }

  findOneById(id: string): Promise<DriverEntity | DriverNotFoundError> {
    const foundDriver = this.drivers.find((driver) => {
      return driver.id === id;
    });

    return Promise.resolve(foundDriver ?? new DriverNotFoundError());
  }

  delete(id: string): Promise<void> {
    this.drivers = this.drivers.filter((driver) => driver.id !== id);
    return Promise.resolve();
  }
}
