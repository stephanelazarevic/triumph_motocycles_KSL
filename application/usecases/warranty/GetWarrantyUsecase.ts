import { WarrantyEntity } from "../../../domain/entities/WarrantyEntity.ts";
import { WarrantyNotFoundError } from "../../../domain/errors/WarrantyNotFoundError.ts";
import { WarrantyRepository } from "../../repositories/WarrantyRepository.ts";

export class GetWarrantyUsecase {
  constructor(private warrantyRepository: WarrantyRepository) {}

  public async execute(id: string): Promise<WarrantyEntity | WarrantyNotFoundError> {
    const existingWarranty = await this.warrantyRepository.findOneById(id);
    if (!existingWarranty) {
      return new WarrantyNotFoundError();
    }

    return existingWarranty;
  }
}
