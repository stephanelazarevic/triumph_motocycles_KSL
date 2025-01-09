import type { MotorcycleRepository } from "../repositories/MotorcycleRepository.ts";

export class ListMotorcyclesUsecase {
  public constructor(
    private readonly motorcycleRepository: MotorcycleRepository,
  ) {}

  public execute() {
    return this.motorcycleRepository.all();
  }
}
