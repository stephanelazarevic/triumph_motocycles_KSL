import { PartEntity } from "../../../domain/entities/PartEntity.ts";
import type { PartRepository } from "../../repositories/PartRepository.ts";

export class ListPartsUsecase {
  public constructor(
    private readonly partRepository: PartRepository
  ) {}

  public async execute(): Promise<PartEntity[]> {
    return await this.partRepository.findAll();
  }
}
