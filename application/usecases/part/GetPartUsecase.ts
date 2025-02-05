import { PartEntity } from "../../../domain/entities/PartEntity.ts";
import { PartNotFoundError } from "../../../domain/errors/PartNotFoundError.ts";
import { PartRepository } from "../../repositories/PartRepository.ts";

export class GetPartUsecase {
  constructor(private partRepository: PartRepository) {}

  public async execute(id: string): Promise<PartEntity | PartNotFoundError> {
    const existingPart = await this.partRepository.findOneById(id);
    if (!existingPart) {
      return new PartNotFoundError();
    }

    return existingPart;
  }
}
