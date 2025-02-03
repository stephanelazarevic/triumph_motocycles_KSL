import { MotorcycleStatus } from "../enum/MotorcycleEnum.ts";
import { MotorcycleCannotAssignToBothClientAndDriverError } from "../errors/MotorcycleCannotAssignToBothClientAndDriverError.ts";
import { Brand } from "../value-objects/Brand.ts";
import { Model } from "../value-objects/Model.ts";
import { Entity } from "./Entity.ts";

export class MotorcycleEntity extends Entity{
  private constructor(
    public dealerId: string,
    public brand: Brand,
    public model: Model,
    public year: number,
    public registrationNumber: string,
    public status: MotorcycleStatus,
    public clientId?: string,
    public driverId?: string,
  ) {
    super();
  }

  public isAssignedToClient(clientId?: string): boolean
    {
      return clientId !== null;
    }

  public isAssignedToDriver(driverId?: string): boolean
  {
    return driverId !== null;
  }

  public static create( params: {
    dealerId: string;
    brand: Brand;
    model: Model;
    year: number;
    registrationNumber: string;
    status: MotorcycleStatus;
    clientId?: string;
    driverId?: string;
  }): MotorcycleEntity | Error {

    if(params.clientId && params.driverId){
      return new MotorcycleCannotAssignToBothClientAndDriverError()
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
