import { MotorcyclePartEntity } from "../../../domain/entities/MotorcyclePartEntity.ts";
import { MotorcycleNotFoundError } from "../../../domain/errors/MotorcycleNotFoundError.ts";
import { MotorcyclePartNotFoundError } from "../../../domain/errors/MotorcyclePartNotFoundError.ts";
import { PartNotFoundError } from "../../../domain/errors/PartNotFoundError.ts";
import { AddMotorcyclePartCommand } from "../../../domain/types/MotorcyclePartType.ts";
import type { MotorcyclePartRepository } from "../../repositories/MotorcyclePartRepository.ts";
import type { MotorcycleRepository } from "../../repositories/MotorcycleRepository.ts";
import type { PartRepository } from "../../repositories/PartRepository.ts";

export class AddMotorcyclePartUsecase {
  public constructor(
    private readonly motorcyclePartRepository: MotorcyclePartRepository,
    private readonly motorcycleRepository: MotorcycleRepository,
    private readonly partRepository: PartRepository,
  ) {}

  public async execute(command: AddMotorcyclePartCommand): Promise<MotorcyclePartEntity | MotorcyclePartNotFoundError> {
    const motorcycle = await this.motorcycleRepository.findOneById(
      command.motorcycleId,
    );

    if (motorcycle instanceof MotorcycleNotFoundError) {
      throw motorcycle;
    }

    const part = await this.partRepository.findOneById(
      command.partId,
    );

    if (part instanceof PartNotFoundError) {
      throw motorcycle;
    }

    const motorcyclePart = MotorcyclePartEntity.create({
      motorcycle,
      part,
    });

    await this.motorcyclePartRepository.save(motorcyclePart);
    return motorcyclePart;
  }
}
