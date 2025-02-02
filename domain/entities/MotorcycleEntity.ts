import { MotorcycleStatus } from "../enum/MotorcycleEnum.ts";
import { Brand } from "../value-objects/Brand.ts";
import { Model } from "../value-objects/Model.ts";

export class MotorcycleEntity {
  private constructor(
    public id: string,
    public dealerIdentifier: string,
    public brand: Brand,
    public model: Model,
    public year: number,
    public registrationNumber: number,
    public status: MotorcycleStatus,
    public clientId?: string,
    public driverId?: string,
  ) {}

  public static isAssignedToClient(clientId?: string): boolean
    {
      return clientId !== null;
    }

  public static isAssignedToDriver(driverId?: string): boolean
  {
    return driverId !== null;
  }

  public static create(dealerIdentifier: string, brand: Brand, model: Model, year: number, registrationNumber: number, motorcycleStatus: MotorcycleStatus, clientId?: string, driverId?:string): MotorcycleEntity {

    if(this.isAssignedToClient(clientId) && this.isAssignedToDriver(driverId)){
      throw new Error("Cannot assign a motorcycle to both a client and a driver"); 
    }
  
    const identifier = crypto.randomUUID();

    return new MotorcycleEntity(
      identifier,
      dealerIdentifier,
      brand,
      model,
      year,
      registrationNumber,
      motorcycleStatus
    );
  }
}
