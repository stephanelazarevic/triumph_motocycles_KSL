import type { PartRepository } from "../repositories/PartRepository.ts";

export class ListPartsUsecase {
  public constructor(
    private readonly partRepository: PartRepository,
  ) {}

  public execute() {
    return this.partRepository.all();
  }
}
