import { MotorcycleStatus } from "../enum/MotorcycleEnum.ts";
import { Brand } from "../value-objects/Brand.ts";
import { Model } from "../value-objects/Model.ts";
import { Entity } from "./Entity.ts";

export class MotorcycleEntity extends Entity{
  private constructor(
    public dealerId: string,
    public brand: Brand,
    public model: Model,
    public year: number,
    public registrationNumber: number,
    public status: MotorcycleStatus,
    public clientId?: string,
    public driverId?: string,
  ) {
    super();
  }

  public static isAssignedToClient(clientId?: string): boolean
    {
      return clientId !== null;
    }

  public static isAssignedToDriver(driverId?: string): boolean
  {
    return driverId !== null;
  }

  public static create( params: {
    dealerId: string;
    brand: Brand;
    model: Model;
    year: number;
    registrationNumber: number;
    status: MotorcycleStatus;
    clientId?: string;
    driverId?: string;
  }): MotorcycleEntity | Error {

    if(this.isAssignedToClient(params.clientId) && this.isAssignedToDriver(params.driverId)){
      // @TODO create specific Error
      throw new Error("Cannot assign a motorcycle to both a client and a driver");
    }

    return new MotorcycleEntity(
      params.dealerId,
      params.brand,
      params.model,
      params.year,
      params.registrationNumber,
      params.status,
      params.clientId,
      params.driverId
    );
  }
}
