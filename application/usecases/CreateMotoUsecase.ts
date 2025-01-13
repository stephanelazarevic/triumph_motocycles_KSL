import { MotoEntity } from "../../domain/entities/MotoEntity.ts";
import { PartNotFoundError } from "../../domain/errors/PartNotFoundError.ts"; // Erreur personnalisée si la pièce n'est pas trouvée
import type { MotoRepository } from "../repositories/MotoRepository.ts";
import type { PartRepository } from "../repositories/PartRepository.ts";

export class CreateMotoUsecase {
  public constructor(
    private readonly motoRepository: MotoRepository,
    private readonly partRepository: PartRepository,
  ) {}

  /**
   * Exécute la création d'une nouvelle moto.
   * @param partId - Identifiant de la pièce associée.
   * @param model - Modèle de la moto.
   * @param registrationNumber - Numéro d'immatriculation de la moto.
   * @param status - Statut de la moto.
   * @returns Une erreur en cas d'échec ou undefined si la création réussit.
   */
  public async execute(
    partId: string,
    model: string,
    registrationNumber: string,
    status: string,
  ) {
    // Vérifie si la pièce associée existe
    const part = await this.partRepository.findOneById(partId);

    if (!part) {
      return new PartNotFoundError(); // Si la pièce n'existe pas, retourne une erreur
    }

    // Crée l'entité de la moto
    const moto = MotoEntity.create(partId, model, registrationNumber, status);

    // Sauvegarde la moto dans le repository
    await this.motoRepository.save(moto);
  }
}
