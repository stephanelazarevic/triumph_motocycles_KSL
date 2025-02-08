import { WarrantyPartNotFoundError } from "../../../domain/errors/WarrantyPartNotFoundError.ts";
import { WarrantyPartRepository } from "../../repositories/WarrantyPartRepository.ts";

export class DeleteWarrantyPartUsecase {
  constructor(private warrantyPartRepository: WarrantyPartRepository) {}

  public async execute(id: string): Promise<WarrantyPartNotFoundError | void> {
    const existingWarrantyPart = await this.warrantyPartRepository.findOneById(id);
    if (!existingWarrantyPart) {
      return new WarrantyPartNotFoundError();
    }

    await this.warrantyPartRepository.delete(id);
  }
}
