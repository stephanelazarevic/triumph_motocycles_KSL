import { WarrantyNotFoundError } from "../../../domain/errors/WarrantyNotFoundError.ts";
import { WarrantyRepository } from "../../repositories/WarrantyRepository.ts";

export class DeleteWarrantyUsecase {
  constructor(private warrantyRepository: WarrantyRepository) {}

  public async execute(id: string): Promise<WarrantyNotFoundError | void> {
    const existingWarranty = await this.warrantyRepository.findOneById(id);
    if (!existingWarranty) {
      return new WarrantyNotFoundError();
    }

    await this.warrantyRepository.delete(id);
  }
}
