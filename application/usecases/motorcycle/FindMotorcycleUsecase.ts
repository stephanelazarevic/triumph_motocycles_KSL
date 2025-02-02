import { MotorcycleEntity } from "../../../domain/entities/MotorcycleEntity.ts";
import { MotorcycleNotFoundError } from "../../../domain/errors/MotorcycleNotFoundError.ts";
import { MotorcycleRepository } from "../../repositories/MotorcycleRepository.ts";

export class FindMotorcycleUsecase {
  constructor(private motorcycleRepository: MotorcycleRepository) {}

  public async execute(id: string): Promise<MotorcycleEntity | MotorcycleNotFoundError> {
    const existing = await this.motorcycleRepository.findOneById(id);
    if (!existing) {
      return new MotorcycleNotFoundError();
    }
    return existing;
  }
}
