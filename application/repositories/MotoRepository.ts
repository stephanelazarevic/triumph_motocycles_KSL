import type { MotoEntity } from "../../domain/entities/MotoEntity.ts";

export interface MotoRepository {
  save(moto: MotoEntity): Promise<void>;
  all(): Promise<MotoEntity[]>;
  findOneById(id: string): Promise<MotoEntity | null>;
  findByPartId(partId: string): Promise<MotoEntity[] | null>; // Optionnel : Trouver des motos par une pièce
}
