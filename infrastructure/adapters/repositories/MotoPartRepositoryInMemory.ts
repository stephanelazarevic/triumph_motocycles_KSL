import type { MotoPartRepository } from "../../../application/repositories/MotoPartRepository.ts";
import type { MotoPartEntity } from "../../../domain/entities/MotoPartEntity.ts";

export class MotoPartRepositoryInMemory implements MotoPartRepository {
  public constructor(private readonly motoParts: MotoPartEntity[]) {}

  public save(motoPart: MotoPartEntity): Promise<void> {
    this.motoParts.push(motoPart);
    return Promise.resolve();
  }

  public all(): Promise<MotoPartEntity[]> {
    return Promise.resolve(this.motoParts);
  }

  public findOneById(id: string): Promise<MotoPartEntity | null> {
    const motoPart = this.motoParts.find((mp) => mp.identifier === id);
    return Promise.resolve(motoPart ?? null);
  }

  /**
   * Trouve des MotoPartEntity en fonction de l'ID du client.
   * @param clientId - L'identifiant du client.
   * @returns Les MotoPartEntity correspondantes ou un tableau vide si non trouvé.
   */
  public findByClientId(clientId: string): Promise<MotoPartEntity[]> {
    const motoParts = this.motoParts.filter((mp) => mp.clientId === clientId);
    return Promise.resolve(motoParts);
  }

  /**
   * Trouve des MotoPartEntity en fonction de l'ID du concessionnaire.
   * @param dealerId - L'identifiant du concessionnaire.
   * @returns Les MotoPartEntity correspondantes ou un tableau vide si non trouvé.
   */
  public findByDealerId(dealerId: string): Promise<MotoPartEntity[]> {
    const motoParts = this.motoParts.filter((mp) => mp.dealerId === dealerId);
    return Promise.resolve(motoParts);
  }
}
