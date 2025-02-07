import { WarrantyPartEntity } from "../../../domain/entities/WarrantyPartEntity.ts";
import type { WarrantyPartRepository } from "../../repositories/WarrantyPartRepository.ts";
import type { WarrantyRepository } from "../../repositories/WarrantyRepository.ts";
import type { PartRepository } from "../../repositories/PartRepository.ts";
import { AddWarrantyPartCommand } from "../../../domain/types/WarrantyPartType.ts";
import { WarrantyNotFoundError } from "../../../domain/errors/WarrantyNotFoundError.ts";
import { PartNotFoundError } from "../../../domain/errors/PartNotFoundError.ts";

export class AddWarrantyPartUsecase {
  public constructor(
    private readonly warrantyPartRepository: WarrantyPartRepository,
    private readonly warrantyRepository: WarrantyRepository,
    private readonly partRepository: PartRepository,
  ) {}

  public async execute(command: AddWarrantyPartCommand): Promise<WarrantyPartEntity | Error> {
    const warranty = await this.warrantyRepository.findOneById(
        command.warrantyId,
      );
  
      if (warranty instanceof WarrantyNotFoundError) {
        return warranty;
      }

    const part = await this.partRepository.findOneById(
      command.partId,
    );

    if (part instanceof PartNotFoundError) {
      return part;
    }

    const warrantyPart = WarrantyPartEntity.create( {
      warranty,
      part,
      coveredCost: command.coveredCost,
      remainingCost: command.remainingCost,
    });

    await this.warrantyPartRepository.save(warrantyPart);
    return warrantyPart;
  }
}
