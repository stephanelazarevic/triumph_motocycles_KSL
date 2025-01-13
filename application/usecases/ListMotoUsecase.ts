import type { MotoRepository } from "../repositories/MotoRepository.ts";

export class ListMotosUsecase {
  public constructor(
    private readonly motoRepository: MotoRepository,
  ) {}

  /**
   * Exécute la récupération de toutes les motos.
   * @returns Une promesse avec la liste de toutes les motos.
   */
  public execute() {
    return this.motoRepository.all();
  }
}
