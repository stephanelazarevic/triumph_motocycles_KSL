import { MotorcycleStatus } from "../enum/MotorcycleEnum.ts";
import { MotorcycleCannotAssignToBothClientAndDriverError } from "../errors/MotorcycleCannotAssignToBothClientAndDriverError.ts";
import { MotorcycleCannotAssignToBothClientAndEnterpriseError } from "../errors/MotorcycleCannotAssignToBothClientAndEnterpriseError.ts";
import { MotorcycleMustHaveEnterpriseIfDriverError } from "../errors/MotorcycleMustHaveEnterpriseIfDriverError.ts";
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
    public enterpriseId: string | null,
  ) {
    super();
  }

  public static isAssignedToClient(clientId: string | null | undefined): boolean{
      return clientId !== null;
    }

    public static isAssignedToDrivers(drivers?: DriverEntity[] | null): boolean {
      return !!drivers && drivers.length > 0;
    }

  public static isAssignedToEntreprise(entrepriseId: string | null | undefined): boolean{
      return entrepriseId !== null;
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
    enterpriseId: string | null;
  }): MotorcycleEntity | Error {

    if(params.clientId && params.drivers){
      return new MotorcycleCannotAssignToBothClientAndDriverError()
    }

    if (params.clientId && params.enterpriseId) {
      return new MotorcycleCannotAssignToBothClientAndEnterpriseError();
    }

    if (params.drivers && params.drivers.length > 0 && !params.enterpriseId) {
      return new MotorcycleMustHaveEnterpriseIfDriverError();
    }

    return new MotorcycleEntity(
      params.dealerId,
      params.brand,
      params.model,
      params.year,
      params.registrationNumber,
      params.status,
      params.clientId,
      params.drivers,
      params.enterpriseId
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
    enterpriseId: string | null
  }): MotorcycleEntity {
    return new MotorcycleEntity(
      data.dealerId,
      Brand.reconstitute(data.brand),
      Model.reconstitute(data.model),
      data.year,
      data.registrationNumber,
      MotorcycleStatus[data.status.toLowerCase() as keyof typeof MotorcycleStatus],
      data.clientId,
      data.drivers,
      data.enterpriseId
    );
  }
}
