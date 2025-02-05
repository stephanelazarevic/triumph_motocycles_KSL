import { PartRepository } from "../../repositories/PartRepository.ts";
import { PartNotFoundError } from "../../../domain/errors/PartNotFoundError.ts";

export class DeletePartUsecase {
  constructor(private partRepository: PartRepository) {}

  public async execute(id: string): Promise<PartNotFoundError | void> {
    const existingPart = await this.partRepository.findOneById(id);
    if (!existingPart) {
      return new PartNotFoundError();
    }

    await this.partRepository.delete(id);
  }
}
