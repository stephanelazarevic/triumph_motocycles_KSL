import { WarrantyEntity } from "../../../domain/entities/WarrantyEntity";
import { WarrantyNotFoundError } from "../../../domain/errors/WarrantyNotFoundError";
import { WarrantyRepository } from "../../repositories/WarrantyRepository";

export class FindWarrantyUsecase {
  constructor(private warrantyRepository: WarrantyRepository) {}

  public async execute(id: string): Promise<WarrantyEntity | WarrantyNotFoundError> {
    const existing = await this.warrantyRepository.findOneById(id);
    if (!existing) {
      return new WarrantyNotFoundError();
    }
    return existing;
  }
}
