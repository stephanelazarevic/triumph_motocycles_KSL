import { MotorcyclePartEntity } from "../../../domain/entities/MotorcyclePartEntity.ts";
import { MotorcyclePartNotFoundError } from "../../../domain/errors/MotorcyclePartNotFoundError.ts";
import { MotorcyclePartRepository } from "../../repositories/MotorcyclePartRepository.ts";

export class GetMotorcyclePartUsecase {
  constructor(private motorcyclePartRepository: MotorcyclePartRepository) {}

  public async execute(id: string): Promise<MotorcyclePartEntity | MotorcyclePartNotFoundError> {
    const existingMotorcyclePart = await this.motorcyclePartRepository.findOneById(id);
    if (!existingMotorcyclePart) {
      return new MotorcyclePartNotFoundError();
    }
    return existingMotorcyclePart;
  }
}
