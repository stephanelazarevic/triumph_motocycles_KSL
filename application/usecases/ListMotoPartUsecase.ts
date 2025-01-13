import type { MotoPartRepository } from "../repositories/MotoPartRepository.ts";

export class ListMotoPartsUsecase {
  public constructor(
    private readonly motoPartRepository: MotoPartRepository,
  ) {}

  /**
   * Exécute la récupération de tous les enregistrements motoPart.
   * @returns Une promesse avec la liste de tous les motoParts.
   */
  public execute() {
    return this.motoPartRepository.all();
  }
}
