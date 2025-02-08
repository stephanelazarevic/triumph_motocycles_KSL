import { MotorcycleStatus } from "../enum/MotorcycleEnum.ts";
import { MotorcycleCannotAssignToBothClientAndDriverError } from "../errors/MotorcycleCannotAssignToBothClientAndDriverError.ts";
import { Brand } from "../value-objects/Brand.ts";
import { Model } from "../value-objects/Model.ts";
import { DriverEntity } from "./DriverEntity.ts";
import { Entity } from "./Entity.ts";

export class MotorcycleEntity extends Entity{
  private constructor(
    public dealerId: string,
    public brand: Brand,
    public model: Model,
    public year: number,
    public registrationNumber: string,
    public status: MotorcycleStatus,
    public clientId: string | null,
    public drivers: DriverEntity[] | null,
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
    registrationNumber: string;
    status: MotorcycleStatus;
    clientId: string | null;
    drivers: DriverEntity[] | null;
  }): MotorcycleEntity | Error {

    if(params.clientId && params.drivers){
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
      params.drivers
    );
  }

  static reconstitute(data: {
    id: string;
    dealerId: string;
    brand: string;
    model: string;
    year: number;
    registrationNumber: string;
    status: string;
    clientId: string | null;
    drivers: DriverEntity[] | null;
  }): MotorcycleEntity {
    return new MotorcycleEntity(
      data.dealerId,
      Brand.reconstitute(data.brand),
      Model.reconstitute(data.model),
      data.year,
      data.registrationNumber,
      MotorcycleStatus[data.status.toLowerCase() as keyof typeof MotorcycleStatus],
      data.clientId,
      data.drivers
    );
  }
}
