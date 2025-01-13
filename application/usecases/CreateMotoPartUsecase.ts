import { MotoPartEntity } from "../../domain/entities/MotoPartEntity.ts";
import type { MotoPartRepository } from "../repositories/MotoPartRepository.ts";
import type { ClientRepository } from "../repositories/ClientRepository.ts";
import type { DealerRepository } from "../repositories/DealerRepository.ts";

export class CreateMotoPartUsecase {
  public constructor(
    private readonly motoPartRepository: MotoPartRepository,
    private readonly clientRepository: ClientRepository,
    private readonly dealerRepository: DealerRepository,
  ) {}

  /**
   * Exécute la création d'un enregistrement motoPart.
   * @param clientId - Identifiant du client (peut être null).
   * @param dealerId - Identifiant du concessionnaire.
   * @param model - Modèle de la moto.
   * @param registrationNumber - Numéro d'immatriculation de la moto.
   * @param status - Statut de la moto.
   * @returns Une erreur en cas d'échec ou undefined si la création réussit.
   */
  public async execute(
    clientId: string | null,
    dealerId: string,
    model: string,
    registrationNumber: string,
    status: string,
  ) {
    // Vérifie si le client existe (si nécessaire)
    if (clientId) {
      const client = await this.clientRepository.findOneById(clientId);
      if (!client) {
        return new Error("Client not found");
      }
    }

    // Vérifie si le concessionnaire existe
    const dealer = await this.dealerRepository.findOneById(dealerId);

    if (!dealer) {
      return new Error("Dealer not found");
    }

    // Crée l'entité de motoPart
    const motoPart = MotoPartEntity.create(clientId, dealerId, model, registrationNumber, status);

    // Sauvegarde l'enregistrement dans le repository
    await this.motoPartRepository.save(motoPart);
  }
}
