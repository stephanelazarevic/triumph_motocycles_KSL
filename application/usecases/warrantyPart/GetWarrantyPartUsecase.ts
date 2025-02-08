import { WarrantyPartEntity } from "../../../domain/entities/WarrantyPartEntity.ts";
import { WarrantyPartNotFoundError } from "../../../domain/errors/WarrantyPartNotFoundError.ts";
import { WarrantyPartRepository } from "../../repositories/WarrantyPartRepository.ts";

export class GetWarrantyPartUsecase {
  constructor(private warrantyPartRepository: WarrantyPartRepository) {}

  public async execute(id: string): Promise<WarrantyPartEntity | WarrantyPartNotFoundError> {
    const existingWarrantyPart = await this.warrantyPartRepository.findOneById(id);
    if (!existingWarrantyPart) {
      return new WarrantyPartNotFoundError();
    }

    return existingWarrantyPart;
  }
}
