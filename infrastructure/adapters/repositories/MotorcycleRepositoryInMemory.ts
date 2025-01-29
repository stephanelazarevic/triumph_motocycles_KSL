import { MotorcycleRepository } from "../../../application/repositories/MotorcycleRepository.ts";
import { MotorcycleEntity } from "../../../domain/entities/MotorcycleEntity.ts";
import { MotorcycleNotFoundError } from "../../../domain/errors/MotorcycleNotFoundError.ts";

export class MotorcycleRepositoryInMemory implements MotorcycleRepository{
  public constructor(private motorcycles: MotorcycleEntity[]) {}

  public save(motorcycle: MotorcycleEntity): Promise<void> {
    this.motorcycles.push(motorcycle);

    return Promise.resolve();
  }

  public findAll(): Promise<MotorcycleEntity[]> {
    return Promise.resolve(this.motorcycles);
  }

  public findOneById(id: string): Promise<MotorcycleEntity | MotorcycleNotFoundError> {
    const foundMotorcycle = this.motorcycles.find((motorcycle) => {
      return motorcycle.identifier === id;
    });

    return Promise.resolve(foundMotorcycle ?? new MotorcycleNotFoundError());
  }

  public delete(id: string): Promise<void> {
    this.motorcycles = this.motorcycles.filter(
      (motorcycle) => motorcycle.identifier !== id
    );
    return Promise.resolve();
  }
}
