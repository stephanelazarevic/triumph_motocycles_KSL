import { MotorcycleEntity } from "../../../domain/entities/MotorcycleEntity.ts";
import { AddMotorcycleCommand } from "../../../domain/types/MotorcycleType.ts";
import { Brand } from "../../../domain/value-objects/Brand.ts";
import { Model } from "../../../domain/value-objects/Model.ts";
import type { MotorcycleRepository } from "../../repositories/MotorcycleRepository.ts";
import { AddMotorcycleHistoryUsecase } from "../motorcycleHistory/AddMotorcycleHistoryUsecase.ts";

export class AddMotorcycleUsecase {
  public constructor(
    private readonly motorcycleRepository: MotorcycleRepository,
    private readonly addMotorcycleHistoryUsecase: AddMotorcycleHistoryUsecase
  ) {}

    public async execute(command: AddMotorcycleCommand): Promise<MotorcycleEntity | Error> { 

    const motorcycleBrand = Brand.from(command.brand);
    if (motorcycleBrand instanceof Error) {
      return motorcycleBrand;
    }

    const motorcycleModel = Model.from(command.model);
    if (motorcycleModel instanceof Error) {
      return motorcycleModel;
    }

    const motorcycle = MotorcycleEntity.create({
      dealerId: command.dealerId,
      brand: motorcycleBrand,
      model: motorcycleModel,
      year: command.year,
      registrationNumber: command.registrationNumber,
      status: command.status,
      clientId: command.clientId ?? null,
      drivers: command.drivers ?? null,
      enterpriseId: command.enterpriseId ?? null
    });

    if(motorcycle instanceof Error){
      return motorcycle;
    }

    await this.motorcycleRepository.save(motorcycle);

    const historyCommand = {
      motorcycleId: motorcycle.id,
      startDate: new Date(),
      endDate: null,
      incidents: [],
      maintenances: [],
      clientId: command.clientId ?? null,
      drivers: command.drivers ?? null,
      enterpriseId: command.enterpriseId ?? null
    };

    await this.addMotorcycleHistoryUsecase.execute(historyCommand);

    return motorcycle;
  }
}
