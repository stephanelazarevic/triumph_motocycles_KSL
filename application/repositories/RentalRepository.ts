import { RentalEntity } from "../../domain/entities/RentalEntity.ts";
import { RentalNotFoundError } from "../../domain/errors/RentalNotFoundError.ts";
import { EntityRepositoryInterface } from "./EntityRepositoryInterface.ts";

export interface RentalRepository extends EntityRepositoryInterface<RentalEntity>{
  save(rental: RentalEntity): Promise<void>;
  findAll(): Promise<RentalEntity[]>;
  findOneById(id: string): Promise<RentalEntity | RentalNotFoundError>;
  delete(id: string): Promise<void>;
}
