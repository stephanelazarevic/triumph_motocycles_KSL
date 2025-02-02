import { MotorcycleEntity } from "../../../domain/entities/MotorcycleEntity.ts";
import { MotorcycleStatus } from "../../../domain/enum/MotorcycleEnum.ts";
import { Brand } from "../../../domain/value-objects/Brand.ts";
import { Model } from "../../../domain/value-objects/Model.ts";
import type { MotorcycleRepository } from "../../repositories/MotorcycleRepository.ts";

export class CreateMotorcycleUsecase {
  public constructor(private readonly motorcycleRepository: MotorcycleRepository) {}

  public async execute(dealerId: string, brand: string, model: string, year: number, registrationNumber: number, status: MotorcycleStatus, clientId?: string, driverId?: string): Promise<MotorcycleEntity | Error> {
    const motorcycleBrand = Brand.from(brand);

    if (motorcycleBrand instanceof Error) {
      return motorcycleBrand;
    }

    const motorcycleModel = Model.from(model);

    if (motorcycleModel instanceof Error) {
      return motorcycleModel;
    }

    const motorcycle = MotorcycleEntity.create({
      dealerId,
      brand: motorcycleBrand,
      model: motorcycleModel,
      year,
      registrationNumber,
      status,
      clientId,
      driverId,
    });

    if(motorcycle instanceof Error){
      return motorcycle;
    }

    await this.motorcycleRepository.save(motorcycle);
    return motorcycle;
  }
}
