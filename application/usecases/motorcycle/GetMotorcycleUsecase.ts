import { MotorcycleEntity } from "../../../domain/entities/MotorcycleEntity.ts";
import { MotorcycleNotFoundError } from "../../../domain/errors/MotorcycleNotFoundError.ts";
import { MotorcycleRepository } from "../../repositories/MotorcycleRepository.ts";

export class GetMotorcycleUsecase {
  constructor(private motorcycleRepository: MotorcycleRepository) {}

  public async execute(id: string): Promise<MotorcycleEntity | MotorcycleNotFoundError> {
    const existingMotorcycle = await this.motorcycleRepository.findOneById(id);
    if (!existingMotorcycle) {
      return new MotorcycleNotFoundError();
    }
    return existingMotorcycle;
  }
}
