import type { PartEntity } from "../../domain/entities/PartEntity.ts";

export interface PartRepository {
  save(part: PartEntity): Promise<void>;
  all(): Promise<PartEntity[]>;
  findOneById(id: string): Promise<PartEntity | null>;
}
