import { PartEntity } from "../../domain/entities/PartEntity.ts";
import { CommandNotFoundError } from "../../domain/errors/CommandNotFoundError.ts";
import type { PartRepository } from "../repositories/PartRepository.ts";
import type { CommandRepository } from "../repositories/CommandRepository.ts";

export class CreatePartUsecase {
  public constructor(
    private readonly partRepository: PartRepository,
    private readonly commandRepository: CommandRepository,
  ) {}

  /**
   * Exécute la création d'une nouvelle pièce.
   * @param commandId - Identifiant de la commande associée.
   * @param reference - Référence de la pièce.
   * @param type - Type de la pièce.
   * @param price - Prix de la pièce.
   * @param stockQuantity - Quantité en stock.
   * @returns Une erreur en cas d'échec ou undefined si la création réussit.
   */
  public async execute(
    commandId: string,
    reference: string,
    type: string,
    price: number,
    stockQuantity: number,
  ) {
    // Vérifie si la commande existe
    const command = await this.commandRepository.findOneById(commandId);

    if (!command) {
      return new CommandNotFoundError();
    }

    // Crée l'entité de la pièce
    const part = PartEntity.create(
      commandId,
      reference,
      type,
      price,
      stockQuantity,
    );

    // Sauvegarde la pièce dans le repository
    await this.partRepository.save(part);
  }
}
