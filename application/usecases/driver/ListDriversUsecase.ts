import { DriverEntity } from "../../../domain/entities/DriverEntity.ts";
import type { DriverRepository } from "../../repositories/DriverRepository.ts";

export class ListDriversUsecase {
  public constructor(
    private readonly driverRepository: DriverRepository,
  ) {}

  public async execute(): Promise<DriverEntity[]> {
    return await this.driverRepository.findAll();
  }
}
