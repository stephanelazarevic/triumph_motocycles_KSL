import { MotorcyclePartRepository } from "../../../application/repositories/MotorcyclePartRepository.ts";
import { MotorcyclePartEntity } from "../../../domain/entities/MotorcyclePartEntity.ts";
import { MotorcyclePartNotFoundError } from "../../../domain/errors/MotorcyclePartNotFoundError.ts";

export class MotorcyclePartRepositoryInMemory implements MotorcyclePartRepository {
  public constructor(private motorcycleParts: MotorcyclePartEntity[]) {}

  public save(motorcyclePart: MotorcyclePartEntity): Promise<void> {
    this.motorcycleParts.push(motorcyclePart);

    return Promise.resolve();
  }

  public findAll(): Promise<MotorcyclePartEntity[]> {
    return Promise.resolve(this.motorcycleParts);
  }

  public findOneById(id: string): Promise<MotorcyclePartEntity | MotorcyclePartNotFoundError> {
    const foundMotorcyclePart = this.motorcycleParts.find((motorcyclePart) => {
      return motorcyclePart.id === id;
    });

    return Promise.resolve(foundMotorcyclePart ?? new MotorcyclePartNotFoundError());
  }

  public delete(id: string): Promise<void> {
    this.motorcycleParts = this.motorcycleParts.filter(
      (motorcyclePart) => motorcyclePart.id !== id,
    );
    return Promise.resolve();
  }
}
