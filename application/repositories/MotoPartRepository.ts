import type { MotoPartEntity } from "../../domain/entities/MotoPartEntity.ts";

export interface MotoPartRepository {
  save(motoPart: MotoPartEntity): Promise<void>;
  all(): Promise<MotoPartEntity[]>;
  findOneById(id: string): Promise<MotoPartEntity | null>;
  findByClientId(clientId: string): Promise<MotoPartEntity[] | null>; // Optionnel : Trouver des motoParts par client
  findByDealerId(dealerId: string): Promise<MotoPartEntity[] | null>; // Optionnel : Trouver des motoParts par concessionnaire
}
