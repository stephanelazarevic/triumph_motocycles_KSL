import { MotorcycleEntity } from "../../../domain/entities/MotorcycleEntity.ts";
import type { MotorcycleRepository } from "../../repositories/MotorcycleRepository.ts";

export class FindAllMotorcyclesUsecase {
  public constructor(
    private readonly motorcycleRepository: MotorcycleRepository,
  ) {}

  public async execute(): Promise<MotorcycleEntity[]> {
    return await this.motorcycleRepository.findAll();
  }
}
