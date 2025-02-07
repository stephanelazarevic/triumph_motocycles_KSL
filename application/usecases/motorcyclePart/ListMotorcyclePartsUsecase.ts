import { MotorcyclePartEntity } from "../../../domain/entities/MotorcyclePartEntity.ts";
import type { MotorcyclePartRepository } from "../../repositories/MotorcyclePartRepository.ts";

export class ListMotorcyclePartsUsecase {
  public constructor(
    private readonly motorcyclePartRepository: MotorcyclePartRepository,
  ) {}

  public async execute(): Promise<MotorcyclePartEntity[]> {
    return await this.motorcyclePartRepository.findAll();
  }
}
