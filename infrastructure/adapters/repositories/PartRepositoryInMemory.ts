import type { PartRepository } from "../../../application/repositories/PartRepository.ts";
import type { PartEntity } from "../../../domain/entities/PartEntity.ts";

export class PartRepositoryInMemory implements PartRepository {
  public constructor(private readonly parts: PartEntity[]) {}

  /**
   * Sauvegarde une pièce en mémoire.
   * @param part - L'entité PartEntity à sauvegarder.
   */
  public save(part: PartEntity): Promise<void> {
    this.parts.push(part);
    return Promise.resolve();
  }

  /**
   * Récupère toutes les pièces stockées en mémoire.
   * @returns Un tableau des entités PartEntity.
   */
  public all(): Promise<PartEntity[]> {
    return Promise.resolve(this.parts);
  }

  /**
   * Trouve une pièce par son identifiant.
   * @param id - L'identifiant unique de la pièce.
   * @returns La pièce correspondante ou null si non trouvée.
   */
  public findOneById(id: string): Promise<PartEntity | null> {
    const part = this.parts.find((p) => p.identifier === id);
    return Promise.resolve(part ?? null); // Retourne null si undefined
  }
}
