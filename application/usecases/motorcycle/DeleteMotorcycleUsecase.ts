import { MotorcycleRepository } from "../../repositories/MotorcycleRepository.ts";
import { MotorcycleNotFoundError } from "../../../domain/errors/MotorcycleNotFoundError.ts";

export class DeleteMotorcycleUsecase {
  constructor(private motorcycleRepository: MotorcycleRepository) {}

  public async execute(id: string): Promise<MotorcycleNotFoundError | void> {
    const existing = await this.motorcycleRepository.findOneById(id);
    if (!existing) {
      return new MotorcycleNotFoundError();
    }
    await this.motorcycleRepository.delete(id);
  }
}
