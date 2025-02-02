import { WarrantyRepository } from "../../repositories/WarrantyRepository.ts";
import { WarrantyEntity } from "../../../domain/entities/WarrantyEntity.ts";
import { WarrantyNotFoundError } from "../../../domain/errors/WarrantyNotFoundError.ts";

export class UpdateWarrantyUsecase {
  constructor(private warrantyRepository: WarrantyRepository) {}

  public async execute(warrantyId: string, updatedWarranty: WarrantyEntity): Promise<WarrantyNotFoundError | void> {
    const warranty = await this.warrantyRepository.findOneById(warrantyId);
    if (warranty instanceof Error) {
      return warranty;
    }

    warranty.startDate = updatedWarranty.startDate
    warranty.endDate = updatedWarranty.endDate
    warranty.warrantyType = updatedWarranty.warrantyType
    warranty.motorcycle = updatedWarranty.motorcycle
    warranty.terms = updatedWarranty.terms

    await this.warrantyRepository.save(warranty);
  }
}
