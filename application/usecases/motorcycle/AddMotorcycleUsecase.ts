import { MotorcycleEntity } from "../../../domain/entities/MotorcycleEntity.ts";
import { AddMotorcycleCommand } from "../../../domain/types/MotorcycleType.ts";
import { Brand } from "../../../domain/value-objects/Brand.ts";
import { Model } from "../../../domain/value-objects/Model.ts";
import type { MotorcycleRepository } from "../../repositories/MotorcycleRepository.ts";
import type { DealerRepository } from "../../repositories/DealerRepository.ts";
import type { WarrantyRepository } from "../../repositories/WarrantyRepository.ts";

export class AddMotorcycleUsecase {
  public constructor(
    private readonly motorcycleRepository: MotorcycleRepository,
    private readonly dealerRepository,
    private readonly warrantyRepository: WarrantyRepository,
  ) {}

    public async execute(command: AddMotorcycleCommand): Promise<MotorcycleEntity | Error> {

    const dealer = await this.dealerRepository.findOneById(
      command.dealerId,
    );

    if (dealer instanceof Error) {
      return dealer;
    }  

    const warranty = await this.warrantyRepository.findOneById(
      command.warrantyId,
    );

    if (warranty instanceof Error) {
      return warranty;
    }

    const motorcycleBrand = Brand.from(command.brand);
    if (motorcycleBrand instanceof Error) {
      return motorcycleBrand;
    }

    const motorcycleModel = Model.from(command.model);
    if (motorcycleModel instanceof Error) {
      return motorcycleModel;
    }

    const motorcycle = MotorcycleEntity.create({
      dealer,
      warranty,
      brand: motorcycleBrand,
      model: motorcycleModel,
      year: command.year,
      registrationNumber:  command.registrationNumber,
      status: command.status,
      clientId: command.clientId,
      driverId: command.driverId,
    });

    if(motorcycle instanceof Error){
      return motorcycle;
    }

    await this.motorcycleRepository.save(motorcycle);
    return motorcycle;
  }
}
