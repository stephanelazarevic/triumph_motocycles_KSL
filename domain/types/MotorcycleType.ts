import { MotorcycleStatus } from "../enum/MotorcycleEnum.ts";

export interface AddMotorcycleCommand {
  dealerId: string,
  brand: string,
  model: string,
  year: number,
  registrationNumber: string,
  status: MotorcycleStatus,
  clientId?: string,
  driverId?: string
}

export interface UpdateMotorcycleCommand extends Partial<AddMotorcycleCommand>{}
