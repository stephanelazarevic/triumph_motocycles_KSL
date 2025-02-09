import { DriverEntity } from "../entities/DriverEntity.ts";
import { MotorcycleStatus } from "../enum/MotorcycleEnum.ts";

export interface AddMotorcycleCommand {
  dealerId: string,
  warrantyId: string,
  brand: string,
  model: string,
  year: number,
  registrationNumber: string,
  status: MotorcycleStatus,
  clientId?: string,
  drivers?: DriverEntity[],
  enterpriseId?: string
}

export interface UpdateMotorcycleCommand extends Partial<AddMotorcycleCommand>{}
