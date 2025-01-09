import { MotorcycleEntity } from "../../domain/entities/MotorcycleEntity.ts";
import { Brand } from "../../domain/types/Brand.ts";
import { Model } from "../../domain/types/Model.ts";
import type { MotorcycleRepository } from "../repositories/MotorcycleRepository.ts";

export class CreateMotorcycleUsecase {
  public constructor(
    private readonly motorcycleRepository: MotorcycleRepository,
  ) {}

  public async execute(brand: string, model: string, year: number) {
    const motorcycleBrand = Brand.from(brand);

    if (motorcycleBrand instanceof Error) {
      return motorcycleBrand;
    }

    const motorcycleModel = Model.from(model);

    if (motorcycleModel instanceof Error) {
      return motorcycleModel;
    }

    const motorcycle = MotorcycleEntity.create(motorcycleBrand, motorcycleModel, year);

    await this.motorcycleRepository.save(motorcycle);
  }
}
