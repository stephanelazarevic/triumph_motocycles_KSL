import { MotorcyclePartRepository } from "../../repositories/MotorcyclePartRepository.ts";
import { MotorcyclePartNotFoundError } from "../../../domain/errors/MotorcyclePartNotFoundError.ts";

export class DeleteMotorcyclePartUsecase {
  constructor(private motorcyclePartRepository: MotorcyclePartRepository) {}

  public async execute(id: string): Promise<MotorcyclePartNotFoundError | void> {
    const existingMotorcyclePart = await this.motorcyclePartRepository.findOneById(id);
    if (!existingMotorcyclePart) {
      return new MotorcyclePartNotFoundError();
    }

    await this.motorcyclePartRepository.delete(id);
  }
}
