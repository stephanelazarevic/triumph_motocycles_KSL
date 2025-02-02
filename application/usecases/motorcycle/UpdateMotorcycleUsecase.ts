import { MotorcycleRepository } from "../../repositories/MotorcycleRepository.ts";
import { MotorcycleEntity } from "../../../domain/entities/MotorcycleEntity.ts";
import { MotorcycleNotFoundError } from "../../../domain/errors/MotorcycleNotFoundError.ts";

export class UpdateMotorcycleUsecase {
  constructor(private motorcycleRepository: MotorcycleRepository) {}

  public async execute(motorcycle: MotorcycleEntity): Promise<MotorcycleNotFoundError | void> {
    const existing = await this.motorcycleRepository.findOneById(motorcycle.identifier);
    if (!existing) {
      return new MotorcycleNotFoundError();
    }
    await this.motorcycleRepository.save(motorcycle);
  }
}
