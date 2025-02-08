import { MotorcycleStatus } from "../enum/MotorcycleEnum.ts";
import { MotorcycleCannotAssignToBothClientAndDriverError } from "../errors/MotorcycleCannotAssignToBothClientAndDriverError.ts";
import { Brand } from "../value-objects/Brand.ts";
import { Model } from "../value-objects/Model.ts";
import { Entity } from "./Entity.ts";
import { DealerEntity } from "./DealerEntity.ts";
import { WarrantyEntity } from "./WarrantyEntity.ts";

export class MotorcycleEntity extends Entity{
  private constructor(
    public dealer: DealerEntity,
    public warranty: WarrantyEntity,
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
    dealer: DealerEntity;
    warranty: WarrantyEntity,
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
      params.dealer,
      params.warranty,
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
