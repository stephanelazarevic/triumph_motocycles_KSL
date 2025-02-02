import { WarrantyRepository } from "../../repositories/WarrantyRepository.ts";
import { WarrantyEntity } from "../../../domain/entities/WarrantyEntity.ts";
import { WarrantyNotFoundError } from "../../../domain/errors/WarrantyNotFoundError.ts";

export class UpdateWarrantyUsecase {
  constructor(private warrantyRepository: WarrantyRepository) {}

  public async execute(warranty: WarrantyEntity): Promise<WarrantyNotFoundError | void> {
    const existingWarranty = await this.warrantyRepository.findOneById(warranty.id);
    if (!existingWarranty) {
      return new WarrantyNotFoundError();
    }
    await this.warrantyRepository.save(warranty);
  }
}
