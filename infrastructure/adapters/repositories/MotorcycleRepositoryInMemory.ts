import type { MotorcycleRepository } from "../../../application/repositories/MotorcycleRepository.ts";
import type { MotorcycleEntity } from "../../../domain/entities/MotorcycleEntity.ts";

export class MotorcycleRepositoryInMemory implements MotorcycleRepository {
  public constructor(public readonly motorcycles: MotorcycleEntity[]) {}

  public save(motorcycle: MotorcycleEntity): Promise<void> {
    this.motorcycles.push(motorcycle);

    return Promise.resolve();
  }

  public all(): Promise<MotorcycleEntity[]> {
    return Promise.resolve(this.motorcycles);
  }

  public findOneById(id: string): Promise<MotorcycleEntity | null> {
    const foundMotorcycle = this.motorcycles.find((motorcycle) => {
      return motorcycle.identifier === id;
    });

    return Promise.resolve(foundMotorcycle ?? null);
  }
}
