import type { MotoRepository } from "../../../application/repositories/MotoRepository.ts";
import type { MotoEntity } from "../../../domain/entities/MotoEntity.ts";

export class MotoRepositoryInMemory implements MotoRepository {
  public constructor(private readonly motos: MotoEntity[]) {}

  public save(moto: MotoEntity): Promise<void> {
    this.motos.push(moto);
    return Promise.resolve();
  }

  public all(): Promise<MotoEntity[]> {
    return Promise.resolve(this.motos);
  }

  public findOneById(id: string): Promise<MotoEntity | null> {
    const moto = this.motos.find((m) => m.identifier === id);
    return Promise.resolve(moto ?? null);
  }

  /**
   * Trouve une moto par l'ID de la pièce associée (partId).
   * @param partId - L'identifiant de la pièce associée.
   * @returns Les motos correspondantes ou un tableau vide si aucune moto n'est trouvée.
   */
  public findByPartId(partId: string): Promise<MotoEntity[]> {
    const motos = this.motos.filter((m) => m.partId === partId);
    return Promise.resolve(motos); // Retourne un tableau de motos
  }
}
